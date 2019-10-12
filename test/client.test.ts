import 'mocha';
import { expect } from 'chai';
import TellstickClient from '../src/client';

describe('TellstickClient', () => {
  describe('constructor', () => {
    it('parses file paths correctly', () => {
      const path = '/tmp/Tellstick';
      const core = new TellstickClient(path);

      expect(core.connectionOptions).to.eql({ path });
    });

    it('parses host and port correctly', () => {
      const host = '192.168.1.10';
      const port = 5000;
      const core = new TellstickClient(`${host}:${port}`);

      expect(core.connectionOptions).to.eql({ host, port });
    });
  });
});
