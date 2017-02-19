'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventEmitter = require('./lib/EventEmitter.class');

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

var _EventsManager = require('./lib/EventsManager.single');

var _EventsManager2 = _interopRequireDefault(_EventsManager);

var _Plugin = require('./lib/Plugin.class');

var _Plugin2 = _interopRequireDefault(_Plugin);

var _PluginAction = require('./lib/PluginAction.class');

var _PluginAction2 = _interopRequireDefault(_PluginAction);

var _PluginManager = require('./lib/PluginManager.class');

var _PluginManager2 = _interopRequireDefault(_PluginManager);

var _utils = require('./lib/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* EPluginize package.
* 
* @package
*/

exports.default = {
  EventEmitter: _EventEmitter2.default,
  EventsManager: _EventsManager2.default,
  Plugin: _Plugin2.default,
  PluginAction: _PluginAction2.default,
  PluginManager: _PluginManager2.default,
  utils: _utils2.default
};