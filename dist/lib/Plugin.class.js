'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Plugin class:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *   Hooks to particular event types and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *   does some work on the data provided by those
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *   events, if needed
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _PluginAction = require('./PluginAction.class');

var _PluginAction2 = _interopRequireDefault(_PluginAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plugin = function () {
  function Plugin(name) {
    _classCallCheck(this, Plugin);

    this.name = name;
    this.actions = {
      // actions applied to all events
      __all__: [],
      // actions applied to event emitters filtered by RegExp
      __regx__: []
    };
  }

  /**
  * Functions that define what actions to register
  * for what event emitter
  * 
  * @param {String} eventType
  *   Type/Name of the event to register action for
  *   
  * @param {Array} emitterFilter
  *   Filtering array that defines from which event emitters to listen events
  *   
  * @param {Function} func
  *   Action handler
  */


  _createClass(Plugin, [{
    key: 'on',
    value: function on(eventType, emitterFilter, func) {
      var _this = this;

      var action = new _PluginAction2.default(eventType, emitterFilter, func);

      // check all types and type combinations
      if (eventType === '*' && emitterFilter === '*') {
        this.all(action);
      } else if (_lodash2.default.isString(emitterFilter)) {
        if (!this.actions[emitterFilter]) this.actions[emitterFilter] = [];
        this.actions[emitterFilter].push(action);
      } else if (_lodash2.default.isArray(emitterFilter)) {
        emitterFilter.forEach(function (emitter) {
          if (!_this.actions[emitter]) _this.actions[emitter] = [];
          _this.actions[emitter].push(action);
        });
      } else if (_lodash2.default.isRegExp(emitterFilter)) {
        this.actions.__regx__.push(action);
      }

      return this;
    }

    // register function for all events
    // functions will be fired one after another in
    // the order they were registered

  }, {
    key: 'all',
    value: function all(action) {
      this.actions.__all__.push(action);
    }
  }, {
    key: 'onAll',
    value: function onAll(func) {
      var action = new _PluginAction2.default('*', '*', func);
      return this.all(action);
    }
  }]);

  return Plugin;
}();

exports.default = Plugin;