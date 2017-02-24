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
// const main = new EPL.Plugin('Main')

//------------------------------------
first.registerEvent('Initialized');
second.on('Initialized', 'First', function () {
  return console.log("SECOND: First Plugin has initialized");
});
second.on('Future Event', 'First', function () {
  return console.log("SECOND: Future Event emitted here");
});

first.emit('Initialized', 'First');
first.registerEvent('Future Event');
first.emit('Future Event', 'First');
console.log('\n\n');
// //------------------------------------

//------------------------------------
// attach to unregistered event emitter
second.on('Future Event', 'Future Emitter', function (name) {
  return console.log("SECOND: Future Event: ", name);
});
second.on('Future Event', /Future/, function (name) {
  return console.log("SECOND: Future Event: ", name);
});

var future = new _index2.default.Plugin('Future Emitter');
var futureProof = new _index2.default.Plugin('Future Proof');
future.registerEvent('Future Event');
future.emit('Future Event', 'Future');
futureProof.registerEvent('Future Event');
futureProof.emit('Future Event', 'Future Proof');
console.log('\n\n');
//------------------------------------

//------------------------------------
second.on('Future Event', ['AFirst', 'ASecond'], function (name) {
  return console.log("Array Methods", name);
});

var a1 = new _index2.default.Plugin('AFirst');
var a2 = new _index2.default.Plugin('ASecond');

a1.registerEvent('Future Event');
a1.emit('Future Event', 'AFirst');

a2.registerEvent('Future Event');
a2.emit('Future Event', 'ASecond');
console.log('\n\n');
//------------------------------------

second.on(['First', 'Second'], ['AAFirst', 'AASecond'], function (name) {
  return console.log("Array In Arrays Methods", name);
});

var aa1 = new _index2.default.Plugin('AAFirst');
var aa2 = new _index2.default.Plugin('AASecond');

aa1.registerEvents(['First', 'Second']);
aa1.emit('First', 'First - AAFirst');
aa1.emit('Second', 'Second - AAFirst');

aa2.registerEvent('Second');
aa2.emit('Second', 'Second - AASecond');

aa2.registerEvent('First');
aa2.emit('First', 'First - AASecond');
console.log('\n\n');
//------------------------------------

second.on(/REGX/, ['AAAFirst', 'AAASecond'], function (name) {
  return console.log("Array In Arrays Methods", name);
});

var aaa1 = new _index2.default.Plugin('AAAFirst');
var aaa2 = new _index2.default.Plugin('AAASecond');

aaa1.registerEvents(['REGX First', 'REGX Second']);
aaa1.emit('REGX First', 'REGX First - AAAFirst');
aaa1.emit('REGX Second', 'REGX Second - AAAFirst');

aaa2.registerEvent('REGX Second');
aaa2.emit('REGX Second', 'REGX Second - AAASecond');

aaa2.registerEvent('REGX First');
aaa2.emit('REGX First', 'REGX First - AAASecond');
//------------------------------------