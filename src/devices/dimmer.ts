import { Device, Property } from 'gateway-addon';
import { Methods } from '../constants';
import TellstickAdapter from '../adapter';
import { LevelProperty, OnOffProperty } from '../properties';

class DimmerDevice extends Device<TellstickAdapter> {
  constructor(adapter: TellstickAdapter, id: string, name: string) {
    super(adapter, id);
    this.name = name;
    this['@type'] = ['MultiLevelSwitch'];

    this.properties.set('on', new OnOffProperty(this));
    this.properties.set('level', new LevelProperty(this));

    this.setInitialValue();
  }

  async notifyPropertyChanged(property: Property) {
    const description = property.asPropertyDescription();
    const value = await property.getValue();

    if (description['@type'] === 'OnOffProperty') {
      const level = value ? 100 : 0;
      this.properties.get('level')!.setCachedValueAndNotify(level);
    }

    super.notifyPropertyChanged(property);
  }

  private async setInitialValue() {
    const { command, value } = await this.adapter.client.lastSentCommandAndValue(+this.getId());
    if (command & Methods.TURNON) {
      this.properties.get('level')!.setCachedValueAndNotify(100);
      this.properties.get('on')!.setCachedValueAndNotify(true);
    } else if (command & Methods.TURNOFF) {
      this.properties.get('level')!.setCachedValueAndNotify(0);
      this.properties.get('on')!.setCachedValueAndNotify(false);
    } else if (command & Methods.DIM && value) {
      const level = Math.round((value / 255) * 100);
      this.properties.get('level')!.setCachedValueAndNotify(level);
      this.properties.get('on')!.setCachedValueAndNotify(level > 0);
    }
  }
}

export default DimmerDevice;
