'use strict';

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// construct plugins
var first = new _index2.default.Plugin('First'); /**
                                                 * In EPluginize, usually EventEmitters are responsible
                                                 * for emitting stuff, however, this is not the only option.
                                                 * Plugin are just a subclass of EventEmitter, therefore,
                                                 * everything that is possible with EventEmitter is possible
                                                 * with Plugin.
                                                 * 
                                                 * @demo
                                                 */

var second = new _index2.default.Plugin('Second');
var main = new _index2.default.Plugin('Main');

first.registerEvent('Initialized');
second.registerEvent('Initialized');

second.on('Initialized', 'First', function () {
  return console.log("SECOND: First Plugin has initialized");
});
first.on('Initialized', 'Second', function () {
  return console.log("FIRST: Second Plugin has initialized");
});
main.onAll(function (pname) {
  return console.log('MAIN: Plugin ' + pname + ' has initialized');
});

// register all plugins
new _index2.default.PluginManager([first, second, main], _index2.default.EventsManager);

first.emit('Initialized', 'First');
second.emit('Initialized', 'Second');