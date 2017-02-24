'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * In EPluginize, usually EventEmitters are responsible
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * for emitting stuff, however, this is not the only option.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Plugin are just a subclass of EventEmitter, therefore,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * everything that is possible with EventEmitter is possible
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * with Plugin.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * @demo
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// construct plugins
var _EPL$Plugin$mult = _index2.default.Plugin.mult(['First', 'Second', 'Main']),
    _EPL$Plugin$mult2 = _slicedToArray(_EPL$Plugin$mult, 3),
    first = _EPL$Plugin$mult2[0],
    second = _EPL$Plugin$mult2[1],
    main = _EPL$Plugin$mult2[2];

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

first.emit('Initialized', 'First');
second.emit('Initialized', 'Second');