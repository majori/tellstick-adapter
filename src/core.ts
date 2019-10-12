import net from 'net';
import { Commands } from './constants';
import { Device } from './types/core';

class TellstickCore {
  connectionOptions: net.NetConnectOpts;

  constructor(socketPath: string) {
    this.connectionOptions = this.parseConnectionOptions(socketPath);
    this.listDevices = this.listDevices.bind(this);
    this.turnOn = this.turnOn.bind(this);
    this.turnOff = this.turnOff.bind(this);
  }

  public async listDevices(): Promise<Device[]> {
    const numberOfDevices = await this.sendToService(Commands.NUMBER_OF_DEVICES);
    const devices: Device[] = [];
    for (let i = 0; i < numberOfDevices; i++) {
      const id = (await this.sendToService(Commands.DEVICE_ID, i)) as number;
      const name = (await this.sendToService(Commands.NAME, id)) as string;
      devices.push({ id, name });
    }
    return devices;
  }

  public async turnOn(id: number) {
    return this.sendToService(Commands.TURN_ON, id);
  }

  public async turnOff(id: number) {
    return this.sendToService(Commands.TURN_OFF, id);
  }

  public async dim(id: number, level: number) {
    return this.sendToService(Commands.DIM, id, level);
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
      const buffer = Buffer.from(this.stringify(command, parameters), 'utf8');
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

      socket.write(buffer);
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

export default TellstickCore;
