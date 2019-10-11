import net from 'net';
import { Commands } from './constants';
import { Device } from './types/core';

class TellstickCore {
  connectionOptions: net.NetConnectOpts;

  constructor(socketPath: string) {
    this.connectionOptions = this.parseConnectionOptions(socketPath);
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

  private parseConnectionOptions(path: string): net.NetConnectOpts {
    return {
      path,
    };
  }

  private async sendToService(command: Commands, parameter?: number): Promise<number | string> {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.from(this.stringify(command, parameter), 'utf8');
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

  private stringify(command: Commands, parameter?: number): string {
    let result = `${command.length}:${command}`;

    if (parameter) {
      switch (typeof parameter) {
        case 'number':
          result += `i${parameter}s`;
          break;
      }
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
