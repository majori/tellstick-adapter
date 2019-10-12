import { Adapter, Device, Property } from 'gateway-addon';
import { Methods } from './constants';
import TellstickClient from './client';

class SwitchProperty extends Property<SwitchDevice> {
  async setValue(value: unknown) {
    const { client } = this.device.adapter;

    switch (this.name) {
      case 'on':
        const action = value ? client.turnOn : client.turnOff;
        action(+this.device.getId());
        break;
      case 'level':
        const level = Math.round(((value as number) / 100) * 255);
        client.dim(+this.device.getId(), level);
        break;
      default:
        throw new Error('Unsupported property');
    }

    const updatedValue = await super.setValue(value);
    this.device.notifyPropertyChanged(this);
    return updatedValue;
  }
}

class SwitchDevice extends Device<TellstickAdapter> {
  constructor(adapter: TellstickAdapter, id: string, name: string) {
    super(adapter, id);
    this.name = name;
    this['@type'] = ['OnOffSwitch'];
    this.properties.set(
      'on',
      new SwitchProperty(this, 'on', {
        title: 'On/Off',
        type: 'boolean',
        '@type': 'OnOffProperty',
      }),
    );
  }
}

class DimmerDevice extends SwitchDevice {
  constructor(adapter: TellstickAdapter, id: string, name: string) {
    super(adapter, id, name);

    this.properties.set(
      'level',
      new SwitchProperty(this, 'level', {
        title: 'Level',
        type: 'integer',
        unit: 'percent',
        '@type': 'LevelProperty',
      }),
    );
  }
}

class TellstickAdapter extends Adapter {
  client: TellstickClient;

  constructor(addonManager: any, manifest: any) {
    super(addonManager, TellstickAdapter.name, manifest.name);
    addonManager.addAdapter(this);
    this.client = new TellstickClient(manifest.moziot.config.socket);
    this.addDevices();
  }

  async addDevices() {
    const devices = await this.client.listDevices();
    for (const device of devices) {
      const methods = await this.client.supportedMethods(device.id);

      if (methods & Methods.TURNON && methods & Methods.TURNOFF && methods & Methods.DIM) {
        this.handleDeviceAdded(new DimmerDevice(this, device.id.toString(), device.name));
        continue;
      }

      if (methods & Methods.TURNON && methods & Methods.TURNOFF) {
        this.handleDeviceAdded(new SwitchDevice(this, device.id.toString(), device.name));
        continue;
      }
    }
  }
}

export default TellstickAdapter;
