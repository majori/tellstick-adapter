import sinon from 'sinon';
import TellstickAdapter from '../src/adapter';

export function createAddonManager() {
  return {
    addAdapter: sinon.fake(),
  };
}

export function createManifest(config = {}) {
  return {
    moziot: {
      config,
    },
  };
}

export function createAdapter(config: any) {
  const manager = createAddonManager();
  const manifest = createManifest(config);
  return new TellstickAdapter(manager, manifest);
}
