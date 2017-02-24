'use strict';

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// register basic event emitter
var emitter = new _index2.default.EventEmitter('Simple');
emitter.registerEvent('Info Log');
emitter.registerEvent('Error Log');

// create simple plugin
var simpleLogger = new _index2.default.Plugin('Logger');
var simpleSaver = new _index2.default.Plugin('Saver');
// const mainHandler = new EPL.Plugin('Main')

// Listen for all events from all event emitters
simpleLogger.on('*', '*', function (data) {
  console.log("Logging (All Events from All event emitters): ", data);
});

// alternative registration for all events handler
simpleLogger.onAll(function (data) {
  console.log("Logging (All Events from All event emitters) with Alternative: ", data);
});

// throws error directly
simpleLogger.on('*', 'Simple', _index2.default.utils.wrapPossibleError(function (first, second) {
  console.log("This function throws an error", first, second);
  throw new Error('Wants to crash your program');
}));

// Listen for all events from `Simple` event emitter
simpleLogger.on('*', 'Simple', function (data) {
  console.log("Logging all events from `Simple` event emitter: ", data);
});

// Listen `Info Log` event from all emitters
simpleSaver.on('Info Log', '*', function (data) {
  console.log("Saving `Info Log` from all event emitters: ", data);
});

// Listen for events that start with `Info` from `Simple` event emitter
simpleLogger.on(/Info Hey/g, 'Simple', function (data) {
  console.log("Logging `/Info Hey/g` from `Simple` event emitter: ", data);
});

// Listen for events that start with `Info` from event emitters
// whose name starts with `Simple`
simpleLogger.on(/Info/g, /Simple/g, function (data) {
  console.log("Logging `/Info/g` from /Simple/g event emitter: ", data);
});

// register all plugins
// new EPL.PluginManager([ simpleLogger, simpleSaver ], EPL.EventsManager)

emitter.emit('Info Log', ' --- Log String', ' || Second');
emitter.emit('Error Log', ' --- Error Log String');