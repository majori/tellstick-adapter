import sinon from 'sinon';
import TellstickAdapter from '../src/adapter';

export function createAddonManager() {
  return {
    addAdapter: sinon.fake(),
    getGatewayVersion: () => '',
    getUserProfile: () => { return {}; },
    getPreferences: () => { return {}; },
  };
}

export function createAdapter(config: any) {
  const manager = createAddonManager();
  return new TellstickAdapter(manager);
}
