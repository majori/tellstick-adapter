import { Adapter, Device, Property } from 'gateway-addon';
import TellstickCore from './core';

class TellstickDevice extends Device {
  constructor(adapter: Adapter, id: string, name: string) {
    super(adapter, id);
    this.name = name;
  }

  createProperty(id: string, description: {}): Property {
    const property = new Property(this, id, description);
    this.properties.set(id, property);
    return property;
  }
}

class TellstickAdapter extends Adapter {
  tellstick: TellstickCore;

  constructor(addonManager: any, manifest: any) {
    super(addonManager, TellstickAdapter.name, manifest.name);
    addonManager.addAdapter(this);
    this.tellstick = new TellstickCore(manifest.moziot.config.socket);
    this.addDevices();
  }

  async addDevices() {
    const devices = await this.tellstick.listDevices();
    for (const device of devices) {
      this.handleDeviceAdded(new TellstickDevice(this, device.id.toString(), device.name));
    }
  }
}

export default TellstickAdapter;
