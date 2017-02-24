'use strict';

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// configure to AutoRegister plugins as they are constructed
_index2.default.Plugin.autoRegister();

// create basic event emitters
var sessionEmitter = new _index2.default.EventEmitter('Session');

// register events
sessionEmitter.registerEvents(['Initialized', 'Destroyed']);

// create simple plugin
var simpleLogger = new _index2.default.Plugin('Logger');

// Listen for `Initialized` and 'Destroyed' events from 'Session' emitter
simpleLogger.on(['Initialized', 'Destroyed'], 'Session', function (data) {
  return console.log("SimpleLogger (Session Initialized):", data);
});

sessionEmitter.emit('Initialized', 'example.txt');