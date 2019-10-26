import net from 'net';
import { Commands, Methods, ErrorCodes } from '../constants';
import { Client, DeviceInfo } from '../types/client';

class TelldusCoreClient implements Client {
  connectionOptions: net.NetConnectOpts;

  constructor(socketPath: string) {
    this.connectionOptions = this.parseConnectionOptions(socketPath);
    this.listDevices = this.listDevices.bind(this);
    this.turnOn = this.turnOn.bind(this);
    this.turnOff = this.turnOff.bind(this);
  }

  public async listDevices() {
    const numberOfDevices = await this.sendToService(Commands.NUMBER_OF_DEVICES);
    const devices: DeviceInfo[] = [];
    for (let i = 0; i < numberOfDevices; i++) {
      const id = (await this.sendToService(Commands.DEVICE_ID, i)) as number;
      const name = (await this.sendToService(Commands.NAME, id)) as string;
      devices.push({ id, name });
    }
    return devices;
  }

  public async turnOn(id: number) {
    return this.sendToService(Commands.TURN_ON, id) as Promise<number>;
  }

  public async turnOff(id: number) {
    return this.sendToService(Commands.TURN_OFF, id) as Promise<number>;
  }

  public async dim(id: number, level: number) {
    return this.sendToService(Commands.DIM, id, level) as Promise<number>;
  }

  public async supportedMethods(id: number) {
    const mask = Object.values(Methods)
      .filter(m => typeof m === 'number')
      .reduce((a, b) => a + (b as Methods), 0);
    return this.sendToService(Commands.METHODS, id, mask) as Promise<number>;
  }

  public async lastSentCommand(id: number) {
    const methods = await this.supportedMethods(id);
    const command = (await this.sendToService(Commands.LAST_SENT_COMMANDS, id, methods)) as number;

    if (command < 0) {
      throw new Error(ErrorCodes[command]);
    }
    return command;
  }

  public async lastSentValue(id: number) {
    const value = await this.sendToService(Commands.LAST_SENT_VALUE, id);

    if (value === 'UNKNOWN') {
      return null;
    }

    return +value;
  }

  public async lastSentCommandAndValue(id: number) {
    return {
      command: await this.lastSentCommand(id),
      value: await this.lastSentValue(id),
    };
  }

  private parseConnectionOptions(path: string): net.NetConnectOpts {
    // TODO: This is naive approach
    if (path.includes(':')) {
      const parts = path.split(':');
      return {
        host: parts[0],
        port: parseInt(parts[1], 10),
      };
    }

    return {
      path,
    };
  }

  private async sendToService(command: Commands, ...parameters: Array<number | string>) {
    return new Promise<number | string>((resolve, reject) => {
      const message = this.stringify(command, parameters);
      const buffer = Buffer.from(message, 'utf8');
      const socket = net.createConnection(this.connectionOptions);

      socket.setEncoding('utf-8');

      socket.once('error', err => {
        reject(err);
      });

      socket.once('data', data => {
        socket.end();
        socket.unref();

        const response = this.parse(data.toString());
        resolve(response);
      });

      socket.on('connect', () => {
        socket.write(buffer);
      });
    });
  }

  private stringify(command: Commands, parameters?: Array<number | string>): string {
    let result = `${command.length}:${command}`;

    if (parameters) {
      parameters.forEach(parameter => {
        switch (typeof parameter) {
          case 'number':
            result += `i${parameter}s`;
            break;
          case 'string':
            result += `${parameter.length}:${parameter}`;
            break;
        }
      });
    }

    return result;
  }

  private parse(message: string): number | string {
    const processors: Array<{
      test: RegExp;
      output: (payload: string) => number | string;
    }> = [
      { test: /(?<=i)(.*?)(?=s)/, output: payload => parseInt(payload, 10) },
      { test: /(?<=:)[\w\s+-]+/, output: payload => payload },
    ];

    for (const processor of processors) {
      const match = processor.test.exec(message);
      if (match) {
        return processor.output(match[0].trim());
      }
    }

    throw new Error('Can not find parser for the given response');
  }
}

export default TelldusCoreClient;
