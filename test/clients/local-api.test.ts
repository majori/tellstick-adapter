import 'mocha';
import { expect } from 'chai';
import LocalApiClient from '../../src/clients/local-api';

describe('local-api', () => {
  describe('constructor', () => {
    it('set base URL and headers correctly', () => {
      const url = 'http://192.168.1.100';
      const token = 'test_token';

      const { client } = new LocalApiClient({ url, token });
      expect(client.defaults.headers['Authorization']).to.eq(`Bearer ${token}`);
      expect(client.defaults.baseURL).to.include(url);
    });
  });
});
