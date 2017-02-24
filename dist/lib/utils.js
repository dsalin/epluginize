'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wrapPossibleError = function wrapPossibleError(func) {
  return function () {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    try {
      return func.apply(undefined, params);
    } catch (err) {
      return err;
    }
  };
}; /**
   * Simple utility function to wrap
   * other functions that may throw errors directly,
   * which prevents from stopping the whole application
   * 
   * @function
   */
exports.default = {
  wrapPossibleError: wrapPossibleError
};