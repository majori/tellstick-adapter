/* eslint-disable @typescript-eslint/no-empty-function */
import { Client } from '../types/client';

class LocalAPIClient implements Client {
  constructor(options: unknown) {}

  public async listDevices() {
    return [];
  }

  public async turnOn(id: number) {}

  public async turnOff(id: number) {}

  public async dim(id: number, level: number) {}

  public async supportedMethods(id: number) {
    return 0;
  }

  public async lastSentCommand(id: number) {
    return 0;
  }

  public async lastSentValue(id: number) {
    return 0;
  }

  public async lastSentCommandAndValue(id: number) {
    return {
      command: await this.lastSentCommand(id),
      value: +(await this.lastSentValue(id)),
    };
  }
}

export default LocalAPIClient;
