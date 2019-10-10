import net from 'net';
import { Commands } from './constants';

export async function listDevices() {
  const numberOfDevices = await sendToService(Commands.NUMBER_OF_DEVICES);
  const devices = [];
  for (let i = 0; i < numberOfDevices; i++) {
    const id = (await sendToService(Commands.DEVICE_ID, i)) as number;
    const name = (await sendToService(Commands.NAME, id)) as string;
    devices.push({ id, name });
  }
  return devices;
}

export async function turnOn(id: number) {
  return sendToService(Commands.TURN_ON, id);
}

export async function turnOff(id: number) {
  return sendToService(Commands.TURN_OFF, id);
}

async function sendToService(command: Commands, parameter?: number): Promise<number | string> {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(stringify(command, parameter), 'utf8');
    const socket = net.createConnection(parseInt(process.env.PORT!, 10), process.env.HOSTNAME);

    socket.setEncoding('utf-8');

    socket.once('error', err => {
      reject(err);
    });

    socket.once('data', data => {
      socket.end();
      socket.unref();

      const response = parse(data.toString());
      resolve(response);
    });

    socket.write(buffer);
  });
}

function stringify(command: Commands, parameter?: number): string {
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

function parse(message: string): number | string {
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

listDevices().then(console.log);
