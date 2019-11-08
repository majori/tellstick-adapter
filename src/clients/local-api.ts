/* eslint-disable @typescript-eslint/no-empty-function */
import axios, { AxiosInstance } from 'axios';
import { Client, DeviceInfo } from '../types/client';
import { LocalAPIResponses } from '../types/local-api';

class LocalAPIClient implements Client {
  client: AxiosInstance;

  constructor(options: any) {
    if (!options.url || !options.token) {
      throw Error('Missing URL or token');
    }

    this.client = axios.create({
      baseURL: `${options.url}/api`,
      headers: {
        Authorization: `Bearer ${options.token}`,
      },
    });

    this.client.interceptors.response.use(response => {
      // API can return HTTP status 200, but still have an error
      if (response.data['error']) {
        throw Error(response.data['error']);
      }
      return response;
    });

    this.turnOn = this.turnOn.bind(this);
    this.turnOff = this.turnOff.bind(this);
    this.dim = this.dim.bind(this);
  }

  public async listDevices(): Promise<DeviceInfo[]> {
    const { data } = await this.client.get<LocalAPIResponses.ListDevices>('/devices/list');
    return data.device.map(({ id, name }) => ({ id, name }));
  }

  public async turnOn(id: number) {
    return this.executeCommand('turnOn', { id });
  }

  public async turnOff(id: number) {
    return this.executeCommand('turnOff', { id });
  }

  public async dim(id: number, level: number) {
    return this.executeCommand('dim', { id, level });
  }

  public async supportedMethods(id: number) {
    const device = await this.getDevice(id);
    return device.methods;
  }

  public async lastSentCommand(id: number) {
    const device = await this.getDevice(id);
    return device.state;
  }

  public async lastSentValue(id: number) {
    const device = await this.getDevice(id);
    return device.statevalue === '' ? 0 : (device.statevalue as number);
  }

  public async lastSentCommandAndValue(id: number) {
    return {
      command: await this.lastSentCommand(id),
      value: await this.lastSentValue(id),
    };
  }

  private async executeCommand(command: string, params?: Record<string, string | number>) {
    const response = await this.client.get<LocalAPIResponses.Status>(`/device/${command}`, {
      params,
    });
    return response.data.status === 'success';
  }

  public async getDevice(id: number) {
    const { data } = await this.client.get<LocalAPIResponses.ExtendedDevice>('/device/info', {
      params: { id, supportedMethods: 1023 },
    });
    return data;
  }
}

export default LocalAPIClient;
