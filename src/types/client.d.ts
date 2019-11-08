export class Client {
  constructor(options: unknown);
  public listDevices(): Promise<DeviceInfo[]>;
  public turnOn(id: number): Promise<boolean>;
  public turnOff(id: number): Promise<boolean>;
  public dim(id: number, level: number): Promise<boolean>;
  public supportedMethods(id: number): Promise<number>;
  public lastSentCommand(id: number): Promise<number>;
  public lastSentValue(id: number): Promise<number | null>;
  public lastSentCommandAndValue(id: number): Promise<{ command: number; value: number | null }>;
}

export interface DeviceInfo {
  id: number;
  name: string;
}
