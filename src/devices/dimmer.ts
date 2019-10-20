import { Device } from 'gateway-addon';
import TellstickAdapter from '../adapter';
import { DimProperty, OnOffProperty } from '../properties';

class DimmerDevice extends Device<TellstickAdapter> {
  constructor(adapter: TellstickAdapter, id: string, name: string) {
    super(adapter, id);
    this.name = name;
    this['@type'] = ['Dimmer', 'OnOffSwitch'];

    this.properties.set(
      'on',
      new OnOffProperty(this, 'on', {
        title: 'On/Off',
        type: 'boolean',
        '@type': 'OnOffProperty',
      }),
    );

    this.properties.set(
      'level',
      new DimProperty(this, 'level', {
        title: 'Level',
        type: 'integer',
        unit: 'percent',
        '@type': 'LevelProperty',
      }),
    );
  }
}

export default DimmerDevice;
