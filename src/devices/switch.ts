import { Device } from 'gateway-addon';
import { Methods } from '../constants';
import TellstickAdapter from '../adapter';
import OnOffProperty from '../properties/on-off';

class SwitchDevice extends Device<TellstickAdapter> {
  constructor(adapter: TellstickAdapter, id: string, name: string) {
    super(adapter, id);
    this.name = name;
    this['@type'] = ['OnOffSwitch'];

    this.properties.set('on', new OnOffProperty(this));
    this.setInitialValue();
  }

  private async setInitialValue() {
    const command = await this.adapter.client.lastSentCommand(+this.getId());
    if (command & Methods.TURNON) {
      this.properties.get('on')!.setCachedValueAndNotify(true);
    } else if (command & Methods.TURNOFF) {
      this.properties.get('on')!.setCachedValueAndNotify(false);
    }
  }
}

export default SwitchDevice;
