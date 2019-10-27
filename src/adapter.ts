import { Adapter } from 'gateway-addon';
import { Methods } from './constants';
import { TelldusCoreClient } from './clients';
import { DimmerDevice, SwitchDevice } from './devices';
import { Client } from './types/client';

class TellstickAdapter extends Adapter {
  client: Client;

  constructor(addonManager: any, manifest: any) {
    super(addonManager, TellstickAdapter.name, manifest.name);
    addonManager.addAdapter(this);

    // TODO: Select client (TelldusCore or LocalAPI) based on manifest configs
    this.client = new TelldusCoreClient(manifest.moziot.config.socket);

    this.startPairing();
  }

  async startPairing() {
    const devices = await this.client.listDevices();
    for (const device of devices) {
      const methods = await this.client.supportedMethods(device.id);

      // Determine type of the device
      if (methods & Methods.TURNON && methods & Methods.TURNOFF && methods & Methods.DIM) {
        this.handleDeviceAdded(new DimmerDevice(this, device.id.toString(), device.name));
      } else if (methods & Methods.TURNON && methods & Methods.TURNOFF) {
        this.handleDeviceAdded(new SwitchDevice(this, device.id.toString(), device.name));
      }
    }
  }
}

export default TellstickAdapter;
