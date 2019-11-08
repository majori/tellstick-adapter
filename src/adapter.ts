import { Adapter, AddonManager, Manifest } from 'gateway-addon';
import { Methods } from './constants';
import { TelldusCoreClient, LocalAPIClient } from './clients';
import { DimmerDevice, SwitchDevice } from './devices';
import { Client } from './types/client';

class TellstickAdapter extends Adapter {
  client: Client;

  constructor(addonManager: AddonManager, manifest: Manifest<any>) {
    super(addonManager, TellstickAdapter.name, manifest.name);
    addonManager.addAdapter(this);

    switch (manifest.moziot.config.client) {
      case 'local-api':
        this.client = new LocalAPIClient(manifest.moziot.config);
        break;
      case 'telldus-core':
        this.client = new TelldusCoreClient(manifest.moziot.config);
        break;
      default:
        throw Error('Invalid client type');
    }

    if (process.env.NODE_ENV !== 'test') {
      this.startPairing();
    }
  }

  async startPairing() {
    const devices = await this.client.listDevices();
    for (const device of devices) {
      const supportedMethods = await this.client.supportedMethods(device.id);
      const deviceSupportsMethods = (methods: Methods[]) => {
        for (const method of methods) {
          if (!(supportedMethods & method)) {
            return false;
          }
        }

        return true;
      };

      // Determine type of the device
      if (deviceSupportsMethods([Methods.TURNON, Methods.TURNOFF, Methods.DIM])) {
        // Dimmer switch
        this.handleDeviceAdded(new DimmerDevice(this, device.id.toString(), device.name));
      } else if (deviceSupportsMethods([Methods.TURNON, Methods.TURNOFF])) {
        // On/Off switch
        this.handleDeviceAdded(new SwitchDevice(this, device.id.toString(), device.name));
      } else {
        console.log(`Unsupported device with ID ${device.id}`);
      }
    }
  }
}

export default TellstickAdapter;
