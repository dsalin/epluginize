'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _index = require('../../index.js');

var _index2 = _interopRequireDefault(_index);

var _plugins = require('./plugins');

var _plugins2 = _interopRequireDefault(_plugins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create basic event emitters
var _EPL$EventEmitter$mul = _index2.default.EventEmitter.mult(['E1', 'E2']),
    _EPL$EventEmitter$mul2 = _slicedToArray(_EPL$EventEmitter$mul, 2),
    E1 = _EPL$EventEmitter$mul2[0],
    E2 = _EPL$EventEmitter$mul2[1];

// register events after AFTER event handlers


E1.registerEvents(['Initialized', 'Destroyed']);
E2.registerEvents(['Initialized', 'Destroyed']);

// Emit all the events
E1.emit('Initialized', 'Some Data');
E2.emit('Initialized', 'Some Other Data');
E2.emit('Destroyed', 'Without Errors');