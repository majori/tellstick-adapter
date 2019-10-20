import { Device } from 'gateway-addon';
import TellstickAdapter from '../adapter';
import { LevelProperty, OnOffProperty } from '../properties';

class DimmerDevice extends Device<TellstickAdapter> {
  constructor(adapter: TellstickAdapter, id: string, name: string) {
    super(adapter, id);
    this.name = name;
    this['@type'] = ['MultiLevelSwitch'];

    this.properties.set('on', new OnOffProperty(this));
    this.properties.set('level', new LevelProperty(this));
  }
}

export default DimmerDevice;
