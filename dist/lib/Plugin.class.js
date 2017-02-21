'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _PluginManager = require('./PluginManager.class');

var _PluginManager2 = _interopRequireDefault(_PluginManager);

var _PluginAction = require('./PluginAction.class');

var _PluginAction2 = _interopRequireDefault(_PluginAction);

var _EventEmitter2 = require('./EventEmitter.class');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Plugin class:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *   Hooks to particular event types and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *   does some work on the data provided by those
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *   events, if needed
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Plugin = function (_EventEmitter) {
  _inherits(Plugin, _EventEmitter);

  function Plugin(name) {
    _classCallCheck(this, Plugin);

    var _this = _possibleConstructorReturn(this, (Plugin.__proto__ || Object.getPrototypeOf(Plugin)).call(this, name));

    _this.actions = {
      // actions applied to all events
      __all__: [],
      // actions applied to event emitters filtered by RegExp
      __regx__: []
    };

    if (Plugin.__autoRegister__ && Plugin.PluginManager) Plugin.PluginManager.addPlugin(_this);
    return _this;
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
      var _this2 = this;

      // EventEmitter register event
      if (arguments.length === 2) {
        _get(Plugin.prototype.__proto__ || Object.getPrototypeOf(Plugin.prototype), 'on', this).call(this, arguments[0], arguments[1]);
        return this;
      }

      var action = new _PluginAction2.default(eventType, emitterFilter, func);
      var type = emitterFilter;

      // check all types and type combinations
      if (eventType === '*' && emitterFilter === '*') {
        this.all(action);
        type = '__all__';
      } else if (_lodash2.default.isString(emitterFilter)) {
        if (!this.actions[emitterFilter]) this.actions[emitterFilter] = [];
        this.actions[emitterFilter].push(action);
      } else if (_lodash2.default.isArray(emitterFilter)) {
        emitterFilter.forEach(function (emitter) {
          if (!_this2.actions[emitter]) _this2.actions[emitter] = [];
          _this2.actions[emitter].push(action);
        });
      } else if (_lodash2.default.isRegExp(emitterFilter)) {
        this.actions.__regx__.push(action);
        type = '__regx__';
      }

      // autoregister Plugin
      if (Plugin.autoRegister && Plugin.pluginManager) {
        Plugin.pluginManager.autoRegisterAction(type, action, this);
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
  }], [{
    key: 'autoRegister',
    value: function autoRegister() {
      /**
      * Create shared PluginManager
      * to be used with all instances of Plugin Class.
      * 
      * Note: this is done since no explicit calls to PluginManager
      * are made with autoRegister option enabled. Therefore, a mechanism
      * of sharing PluginManager instance should be established.
      */
      Plugin.pluginManager = new _PluginManager2.default([], null, true);
      Plugin.__autoRegister__ = true;
    }
  }]);

  return Plugin;
}(_EventEmitter3.default);

// Indicates whether Plugins should automatically
// register themselves on construction, or wait for
// a global PluginManager.registerPlugins method to be called


Plugin.__autoRegister__ = false;

exports.default = Plugin;