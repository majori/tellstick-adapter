import 'mocha';
import { expect } from 'chai';
import TellstickCore from '../src/core';

describe('TellstickCore', () => {
  describe('constructor', () => {
    it('parses file paths correctly', () => {
      const path = '/tmp/Tellstick';
      const core = new TellstickCore(path);

      expect(core.connectionOptions).to.eql({ path });
    });

    it('parses host and port correctly', () => {
      const host = '192.168.1.10';
      const port = 5000;
      const core = new TellstickCore(`${host}:${port}`);

      expect(core.connectionOptions).to.eql({ host, port });
    });
  });
});
