'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// configure to AutoRegister plugins as they are constructed
_index2.default.Plugin.autoRegister();

// create basic event emitters

var _EPL$EventEmitter$mul = _index2.default.EventEmitter.mult(['E1', 'E2']),
    _EPL$EventEmitter$mul2 = _slicedToArray(_EPL$EventEmitter$mul, 2),
    E1 = _EPL$EventEmitter$mul2[0],
    E2 = _EPL$EventEmitter$mul2[1];

// register their events


E1.registerEvents(['Initialized', 'Destroyed']);
E2.registerEvents(['Initialized', 'Destroyed']);

// create plugins
// Note: in AutoRegister mode, plugins cannot have 
// multiple handlers for the same events, that is why we create
// a couple more plugins to show the whole power of selectors

var _EPL$Plugin$mult = _index2.default.Plugin.mult(['P1', 'P2', 'P3', 'P4']),
    _EPL$Plugin$mult2 = _slicedToArray(_EPL$Plugin$mult, 4),
    P1 = _EPL$Plugin$mult2[0],
    P2 = _EPL$Plugin$mult2[1],
    P3 = _EPL$Plugin$mult2[2],
    P4 = _EPL$Plugin$mult2[3];

// Listen for all events from 'E1' emitter


P1.on('*', 'E1', function (data) {
  return console.log("Plugin1 - Emitter1 :", data);
});

// Listen for `Initialized` event from All emitters
P2.on('Initialized', '*', function (data) {
  return console.log("Plugin2 - All Emitters:", data);
});

// Did I say we can use RegEx?
// Listen for `Initialized` and `Destroyed` events from emtters that match the RegEx
// Tip: THAT COVERS EVENT EMITTERS CREATED IN THE FUTURE AS WELL! (more on that in the next example)
P3.on(['Initialized', 'Destroyed'], /E/, function (data) {
  return console.log("Plugin3 - Event from /E/ matching emitters: ", data);
});

// Did I say we can use RegEx everywhere?
// Listen for events matching /ed/ from emtters that match the /E/
P4.on(/ed/, /E/, function (data) {
  return console.log("Plugin4 - Event /ed/ from /E/ matching emitters: ", data);
});

E1.emit('Initialized', 'Emitter1');
E2.emit('Initialized', 'Emitter1');
E2.emit('Destroyed', 'Emitter2');