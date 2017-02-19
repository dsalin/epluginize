'use strict';

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// register basic event emitter
var emitter = new _index2.default.EventEmitter('Test'); /**
                                                        * By default, all events in NodeJS are emitted synchronously.
                                                        * This might not be the desired behaviour in majority of ways, therefore
                                                        * `EventEmitter.emitAsync` is introduced.
                                                        * 
                                                        * @demo
                                                        */

emitter.registerEvent('Long Async');
emitter.registerEvent('Long Sync');

console.log("Emitter events: ", emitter.events);

// create simple plugin
var _sync = new _index2.default.Plugin('Sync');
var _async = new _index2.default.Plugin('Async');

_sync.on('Long Sync', 'Test', function () {
  return console.log("Sync method");
});
_async.on('Long Async', 'Test', function () {
  return console.log("Async method");
});

// register all plugins
new _index2.default.PluginManager([_sync, _async], _index2.default.EventsManager);

emitter.emitAsync('Long Async');
emitter.emit('Long Sync');
emitter.emit('Long Sync');