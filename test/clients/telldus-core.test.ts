import 'mocha';
import { expect } from 'chai';
import TelldusCoreClient from '../../src/clients/telldus-core';

describe('telldus-core', () => {
  describe('constructor', () => {
    it('parses file paths correctly', () => {
      const socket = '/tmp/Tellstick';
      const core = new TelldusCoreClient({ socket });

      expect(core.connectionOptions).to.eql({ socket });
    });

    it('parses host and port correctly', () => {
      const host = '192.168.1.10';
      const port = 5000;
      const core = new TelldusCoreClient({ socket: `${host}:${port}` });

      expect(core.connectionOptions).to.eql({ host, port });
    });
  });
});
