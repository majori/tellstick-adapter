import { Adapter, AddonManager, Database } from 'gateway-addon';
import { Methods } from './constants';
import { TelldusCoreClient, LocalAPIClient } from './clients';
import { DimmerDevice, SwitchDevice } from './devices';
import { Client } from './types/client';
import * as manifest from './manifest.json';

class TellstickAdapter extends Adapter {
  client!: Client;
  promise: Promise<void>;

  constructor(addonManager: AddonManager) {
    super(addonManager, TellstickAdapter.name, manifest.id);
    addonManager.addAdapter(this);

    const db = new Database(this.packageName);
    this.promise = db.open().then(() => {
      return db.loadConfig();
    }).then((config) => {
      switch (config.client) {
        case 'local-api':
          this.client = new LocalAPIClient(config);
          break;
        case 'telldus-core':
          this.client = new TelldusCoreClient(config);
          break;
        default:
          throw Error('Invalid client type');
      }

      if (process.env.NODE_ENV !== 'test') {
        this.startPairing();
      }
    }).catch(console.error);
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
