export class Client {
  constructor(options: any);
  public listDevices(): Promise<DeviceInfo[]>;
  public turnOn(id: number): Promise<number>;
  public turnOff(id: number): Promise<number>;
  public dim(id: number, level: number): Promise<number>;
  public supportedMethods(id: number): Promise<number>;
}

export interface DeviceInfo {
  id: number;
  name: string;
}
