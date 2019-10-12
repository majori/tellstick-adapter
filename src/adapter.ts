import { Adapter, Device, Property } from 'gateway-addon';
import TellstickClient from './client';

class TellstickProperty extends Property<TellstickDevice> {
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
      // TODO: Support other properties
      default:
        throw new Error('Unsupported property');
    }

    const updatedValue = await super.setValue(value);
    this.device.notifyPropertyChanged(this);
    return updatedValue;
  }
}

class TellstickDevice extends Device<TellstickAdapter> {
  constructor(adapter: TellstickAdapter, id: string, name: string) {
    super(adapter, id);
    this.name = name;

    // TODO: Check which methods the device supports
    this['@type'] = ['OnOffSwitch'];
    this.properties.set(
      'on',
      new TellstickProperty(this, 'on', {
        title: 'On/Off',
        type: 'boolean',
        '@type': 'OnOffProperty',
      }),
    );

    this.properties.set(
      'level',
      new TellstickProperty(this, 'level', {
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
      this.handleDeviceAdded(new TellstickDevice(this, device.id.toString(), device.name));
    }
  }
}

export default TellstickAdapter;
