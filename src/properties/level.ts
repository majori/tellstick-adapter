import { Property, Device } from 'gateway-addon';
import TellstickAdapter from '../adapter';

class LevelProperty extends Property<Device<TellstickAdapter>> {
  constructor(device: Device<TellstickAdapter>) {
    super(device, 'level', {
      title: 'Level',
      type: 'integer',
      unit: 'percent',
      '@type': 'LevelProperty',
    });
  }

  async setValue(value: unknown) {
    const { client } = this.device.adapter;

    const level = Math.round(((value as number) / 100) * 255);
    await client.dim(+this.device.getId(), level);

    const updatedValue = await super.setValue(value);
    this.device.notifyPropertyChanged(this);
    return updatedValue;
  }
}

export default LevelProperty;
