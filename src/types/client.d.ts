export class Client {
  constructor(options: unknown);
  public listDevices(): Promise<DeviceInfo[]>;
  public turnOn(id: number): Promise<unknown>;
  public turnOff(id: number): Promise<unknown>;
  public dim(id: number, level: number): Promise<unknown>;
  public supportedMethods(id: number): Promise<number>;
  public lastSentCommand(id: number): Promise<number>;
  public lastSentValue(id: number): Promise<number>;
  public lastSentCommandAndValue(id: number): Promise<{ command: number; value: number }>;
}

export interface DeviceInfo {
  id: number;
  name: string;
}
