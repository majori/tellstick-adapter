export enum ErrorCodes {
  SUCCESS = 0, // "Success",
  ERROR_NOT_FOUND = -1, // "TellStick not found",
  ERROR_PERMISSION_DENIED = -2, // "Permission denied",
  ERROR_DEVICE_NOT_FOUND = -3, // "Device not found",
  ERROR_METHOD_NOT_SUPPORTED = -4, // "The method you tried to use is not supported by the device",
  ERROR_COMMUNICATION = -5, // "An error occurred while communicating with TellStick",
  ERROR_CONNECTING_SERVICE = -6, // "Could not connect to the Telldus Service",
  ERROR_UNKNOWN_RESPONSE = -7, // "Received an unknown response",
  ERROR_SYNTAX = -8, // "Input/command could not be parsed or didn't follow input rules",
  ERROR_BROKEN_PIPE = -9, // "Pipe broken during communication.",
  ERROR_COMMUNICATING_SERVICE = -10, // "Timeout waiting for response from the Telldus Service.",
  ERROR_UNKNOWN = -99, // "Unknown"
}

export enum Methods {
  TURNON = 1,
  TURNOFF = 2,
  BELL = 4,
  TOGGLE = 8,
  DIM = 16,
  LEARN = 32,
  EXECUTE = 64,
  UP = 128,
  DOWN = 256,
  STOP = 512,
}

export enum Commands {
  NUMBER_OF_DEVICES = 'tdGetNumberOfDevices',
  DEVICE_ID = 'tdGetDeviceId',
  DEVICE_TYPE = 'tdGetDeviceType',
  METHODS = 'tdMethods',
  NAME = 'tdGetName',
  TURN_ON = 'tdTurnOn',
  TURN_OFF = 'tdTurnOff',
  DIM = 'tdDim',
  LEARN = 'tdLearn',
  LAST_SENT_VALUE = 'tdLastSentValue',
  LAST_SENT_COMMANDS = 'tdLastSentCommand',
}
