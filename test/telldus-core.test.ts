import 'mocha';
import { expect } from 'chai';
import TellstickCoreClient from '../src/clients/telldus-core';

describe('TellstickClient', () => {
  describe('constructor', () => {
    it('parses file paths correctly', () => {
      const path = '/tmp/Tellstick';
      const core = new TellstickCoreClient(path);

      expect(core.connectionOptions).to.eql({ path });
    });

    it('parses host and port correctly', () => {
      const host = '192.168.1.10';
      const port = 5000;
      const core = new TellstickCoreClient(`${host}:${port}`);

      expect(core.connectionOptions).to.eql({ host, port });
    });
  });
});
