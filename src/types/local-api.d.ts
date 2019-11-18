export namespace LocalAPIResponses {
  export interface Status {
    status: string;
  }

  export interface ListDevices {
    device: Device[];
  }

  export interface ExtendedDevice extends Device {
    protocol: string;
    model: string;
  }

  export interface Device {
    id: number;
    methods: number;
    name: string;
    state: number;
    statevalue: string | number;
    type: 'device';
  }
}
