# tellstick-adapter

Telldus Tellstick adapter add-on for WebThings Gateway

## Usage

If you are using Tellstick ZNet Lite v2, follow the [tutorial](https://api.telldus.net/localapi/api/authentication.html) to create access token for your Local API. After that configure Tellstick's URL and the access token to add-on's configuration.

If you are using older generation Tellsticks, select `telldus-core` option from add-on's configuration and make sure to install
[telldus-core](http://developer.telldus.com/wiki/TellStickInstallationSource).
You can also use the provided [Dockerfile](./docker/Dockerfile) to create a container,
which exposes the telldus-core service socket to port 50800. If you are using the container,
modify add-on's `socket` configuration to point to the TCP port, such as `127.0.0.1:50800`.

## Supported Tellsticks

- Tellstick (via telldus-core)
- Tellstick ZNet Lite v2 (via local HTTP API)
- NOT TESTED: Tellstick Duo (output only) (via telldus-core)
- NOT TESTED: Tellstick Net (via local HTTP API)

## Supported device types

- On/Off switches
- Dimmers

## Note

This adapter does not support adding new devices to telldus-core.
Add new devices by editing [tellstick.conf](http://developer.telldus.com/wiki/TellStick_conf) file.
