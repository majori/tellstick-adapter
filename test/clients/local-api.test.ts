import 'mocha';
import { expect } from 'chai';
import nock from 'nock';
import LocalAPIClient from '../../src/clients/local-api';
import { LocalAPIResponses } from '../../src/types/local-api';

describe('local-api', () => {
  const url = 'http://127.0.0.1';
  const token = 'test_token';

  describe('constructor', () => {
    it('set base URL and headers correctly', () => {
      const { client } = new LocalAPIClient({ url, token });
      expect(client.defaults.headers['Authorization']).to.eq(`Bearer ${token}`);
      expect(client.defaults.baseURL).to.include(url);
    });
  });

  describe('commands', () => {
    let client: LocalAPIClient;
    const id = 1;

    const mock = () =>
      nock(`${url}/api`, {
        reqheaders: {
          authorization: `Bearer ${token}`,
        },
      });

    before(() => {
      client = new LocalAPIClient({ url, token });
    });

    it('list devices', async () => {
      const devices: LocalAPIResponses.Device[] = [
        { id: 1, methods: 1, name: 'device_1', state: 0, statevalue: 0, type: 'device' },
        { id: 2, methods: 1, name: 'device_2', state: 0, statevalue: 0, type: 'device' },
      ];
      mock()
        .get('/devices/list')
        .reply(200, { device: devices });

      expect(await client.listDevices()).to.deep.eq(devices.map(({ name, id }) => ({ name, id })));
    });
    describe('turn on', () => {
      it('was successful', async () => {
        mock()
          .get('/device/turnOn')
          .query({ id })
          .reply(200, { status: 'success' });

        expect(await client.turnOn(id)).to.be.true;
      });

      it('failed', async () => {
        mock()
          .get('/device/turnOn')
          .query({ id })
          .reply(200, { status: 'error' });

        expect(await client.turnOn(id)).to.be.false;
      });
    });

    describe('turn off', () => {
      it('was successful', async () => {
        mock()
          .get('/device/turnOff')
          .query({ id })
          .reply(200, { status: 'success' });

        expect(await client.turnOff(id)).to.be.true;
      });

      it('failed', async () => {
        mock()
          .get('/device/turnOff')
          .query({ id })
          .reply(200, { status: 'error' });

        expect(await client.turnOff(id)).to.be.false;
      });
    });

    describe('dim', () => {
      it('was successful', async () => {
        const level = 100;
        mock()
          .get('/device/dim')
          .query({ id, level })
          .reply(200, { status: 'success' });

        expect(await client.dim(id, level)).to.be.true;
      });

      it('failed', async () => {
        const level = 100;
        mock()
          .get('/device/dim')
          .query({ id, level })
          .reply(200, { status: 'error' });

        expect(await client.dim(id, level)).to.be.false;
      });
    });
  });
});
