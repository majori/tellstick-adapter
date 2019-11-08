import 'mocha';
import { expect } from 'chai';
import TelldusCoreClient from '../../src/clients/telldus-core';

describe('telldus-core', () => {
  describe('constructor', () => {
    it('parses file paths correctly', () => {
      const socket = '/tmp/Tellstick';
      const client = new TelldusCoreClient({ socket });

      expect(client.connectionOptions).to.eql({ socket });
    });

    it('parses host and port correctly', () => {
      const host = '192.168.1.10';
      const port = 5000;
      const client = new TelldusCoreClient({ socket: `${host}:${port}` });

      expect(client.connectionOptions).to.eql({ host, port });
    });
  });
});
