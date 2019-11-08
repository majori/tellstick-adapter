import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import TellstickAdapter from '../src/adapter';
import { TelldusCoreClient, LocalAPIClient } from '../src/clients';
import * as utils from './utils';

describe('Adapter', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('adds adapter to the manager', () => {
    const manager = utils.createAddonManager();
    const manifest = utils.createManifest({ client: 'local-api' });
    const adapter = new TellstickAdapter(manager, manifest);

    expect(manager.addAdapter.calledWith(adapter)).to.be.true;
  });

  it('selects "local-api" client based on the config', () => {
    const adapter = utils.createAdapter({ client: 'local-api' });

    expect(adapter.client).to.be.an.instanceOf(LocalAPIClient);
  });

  it('selects "telldus-core" client based on the config', () => {
    const adapter = utils.createAdapter({ client: 'telldus-core', socket: '/tmp/TelldusClient' });

    expect(adapter.client).to.be.an.instanceOf(TelldusCoreClient);
  });
});
