declare module 'gateway-addon' {
  class Property {
    constructor(device: Device, name: string, propertyDescr: {});
    public setCachedValue(value: any): void;
    public setValue(value: any): Promise<void>;
  }

  class Device {
    protected '@context': string;
    protected '@type': string[];
    protected name: string;
    protected description: string;

    constructor(adapter: Adapter, id: string);

    public properties: Map<string, Property>;
    public notifyPropertyChanged(property: Property): void;
    public addAction(name: string, metadata: any): void;
  }

  class Adapter {
    constructor(addonManager: any, id: string, packageName: string);

    public handleDeviceAdded(device: Device): void;
  }

  class Database {
    constructor(packageName: string, path?: string);

    public open(): Promise<void>;
    public loadConfig(): Promise<any>;
    public saveConfig(config: any): Promise<void>;
  }
}
