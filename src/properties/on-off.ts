import { Property, Device } from 'gateway-addon';
import TellstickAdapter from '../adapter';

class OnOffProperty extends Property<Device<TellstickAdapter>> {
  constructor(device: Device<TellstickAdapter>) {
    super(device, 'on', {
      title: 'On/Off',
      type: 'boolean',
      '@type': 'OnOffProperty',
    });
  }

  async setValue(value: unknown) {
    const { client } = this.device.adapter;

    const action = value ? client.turnOn : client.turnOff;
    await action(+this.device.getId());

    const updatedValue = await super.setValue(value);
    this.device.notifyPropertyChanged(this);
    return updatedValue;
  }
}

export default OnOffProperty;
