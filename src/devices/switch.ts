import { Device } from 'gateway-addon';
import TellstickAdapter from '../adapter';
import OnOffProperty from '../properties/on-off';

class SwitchDevice extends Device<TellstickAdapter> {
  constructor(adapter: TellstickAdapter, id: string, name: string) {
    super(adapter, id);
    this.name = name;
    this['@type'] = ['OnOffSwitch'];

    this.properties.set(
      'on',
      new OnOffProperty(this, 'on', {
        title: 'On/Off',
        type: 'boolean',
        '@type': 'OnOffProperty',
      }),
    );
  }
}

export default SwitchDevice;
