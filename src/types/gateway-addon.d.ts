declare module 'gateway-addon' {
  class Property<D = Device> {
    protected name: string;
    protected device: D;

    constructor(device: D, name: string, propertyDescr: {});
    public setCachedValue(value: any): void;
    public setValue(value: any): Promise<any>;
    public getValue(): Promise<any>;
    public setCachedValueAndNotify(value: any): void;
    public asPropertyDescription(): any;
  }

  class Device<A = Adapter> {
    protected '@context': string;
    protected '@type': string[];
    protected name: string;
    protected description: string;
    public adapter: A;

    constructor(adapter: A, id: string);

    public properties: Map<string, Property>;
    public notifyPropertyChanged(property: Property): void;
    public addAction(name: string, metadata: any): void;
    public getId(): string;
  }

  class Adapter {
    protected packageName: string;

    constructor(addonManager: AddonManager, id: string, packageName: string);

    public handleDeviceAdded(device: Device): void;
  }

  interface AddonManager {
    addAdapter(adapter: Adapter): void;
  }

  class Database {
    constructor(packageName: string, path?: string);

    public open(): Promise<void>;
    public loadConfig(): Promise<any>;
    public saveConfig(config: any): Promise<void>;
  }
}
