'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _index = require('../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _EPL$Plugin$mult = _index2.default.Plugin.mult(['P1', 'P2', 'P3', 'P4']),
    _EPL$Plugin$mult2 = _slicedToArray(_EPL$Plugin$mult, 4),
    P1 = _EPL$Plugin$mult2[0],
    P2 = _EPL$Plugin$mult2[1],
    P3 = _EPL$Plugin$mult2[2],
    P4 = _EPL$Plugin$mult2[3];

// For convenience, this refers to plugin object itself, so you don't
// need to worry about those


P1.on('*', 'E1', function (data, eventName, emitterName) {
  console.log(this.name, "Emitter1 :", data, ' | Emitter: ', emitterName, ' | Event:', eventName);
});

P2.on('Initialized', '*', function (data, eventName, emitterName) {
  console.log(this.name, "- All Emitters:", data, ' | Emitter: ', emitterName, ' | Event:', eventName);
});

P3.on(['Initialized', 'Destroyed'], /E/, function (data, eventName, emitterName) {
  console.log(this.name, "- Event from /E/: ", data, ' | Emitter:', emitterName, ' | Event:', eventName);
});

P4.on(/ed/, /E/, function (data, eventName, emitterName) {
  console.log(this.name, "- Event /ed/ from /E/: ", data, ' | Emitter:', emitterName, 'Event:', eventName);
});