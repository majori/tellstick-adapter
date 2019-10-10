import TellstickAdapter from './tellstick-adapter';

export = (addonManager: any, manifest: any) => new TellstickAdapter(addonManager, manifest);
