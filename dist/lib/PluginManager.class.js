'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _EventsManager = require('./EventsManager.single');

var _EventsManager2 = _interopRequireDefault(_EventsManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * PluginManager class:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *   Is responsible for REGISTERING(not creating)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *   new plugins by hooking them to existing event types
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *   Responsibilities:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *     1. Register plugins
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *     2. Control the number of `eventHandlers` for any particular event
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var PluginManager = function (_events$EventEmitter) {
  _inherits(PluginManager, _events$EventEmitter);

  function PluginManager(plugins, eventsManager) {
    var auto = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, PluginManager);

    var _this = _possibleConstructorReturn(this, (PluginManager.__proto__ || Object.getPrototypeOf(PluginManager)).call(this));

    _this.plugins = plugins;
    _this.__plugins__ = {};
    _this.eventsManager = eventsManager || _EventsManager2.default;

    // data containers for AutoRegister option
    _this.__autoRegister__ = auto;
    _this.__auto__ = [];
    _this.__register_table__ = [];

    // do not register plugins immediately if
    // autoRegister option is provied
    if (!auto) _this.registerPlugins();

    // Register event handlers
    _this.eventsManager.on('Emitter/Registered', function (emitter) {
      // console.log('Emitter/Registered', emitter.name)
      // console.log('EMITTERS: ', Object.keys(this.eventsManager.emitters) )
      _this.checkUnregistered(emitter.name);
    });

    _this.eventsManager.on('Event/Registered', function (title, emitter) {
      // console.log(chalk.yellow('Event/Registered'), title, emitter.name)
      _this.checkUnregistered(emitter.name, title);
    });
    return _this;
  }

  _createClass(PluginManager, [{
    key: 'addPlugin',
    value: function addPlugin(plugin) {
      this.plugins.push(plugin);
      this.__plugins__[plugin.name] = plugin;

      this.emit('Plugin/Registered');
      return this;
    }
  }, {
    key: 'registerPlugins',
    value: function registerPlugins() {
      var _this2 = this;

      console.log(_chalk2.default.green('Registering Plugins ...'), this.plugins.map(function (p) {
        return p.name;
      }));
      this.plugins.forEach(function (plugin) {
        return _this2.registerPlugin(plugin);
      });
      return this;
    }

    // Attach necessary handlers to event emitters

  }, {
    key: 'registerPlugin',
    value: function registerPlugin(plugin) {
      var _this3 = this;

      var allRegistered = true;

      Object.keys(plugin.actions).forEach(function (emitterName) {
        return plugin.actions[emitterName].forEach(function (action) {
          if (!_this3.attachEventHandler(emitterName, action, plugin)) allRegistered = false;
        });
      });

      if (!allRegistered) throw new Error('Cannot register all actions for plugin: ' + plugin.name);

      return this;
    }

    /**
    * Automatically register Plugin action
    * Note: can throw error
    * 
    * @can-error
    */

  }, {
    key: 'autoRegisterAction',
    value: function autoRegisterAction(type, action, plugin) {
      this.attachEventHandler(type, action, plugin);
      this.__auto__.push({ type: type, action: action, plugin: plugin });
    }
  }, {
    key: 'checkUnregistered',
    value: function checkUnregistered(emitterName, title) {
      var _this4 = this;

      // console.log(chalk.red("Checkunregistered !!!"), emitterName, title, this.__auto__, '\n')
      this.__auto__ = this.__auto__.filter(function (r) {
        _this4.attachEventHandler(r.type, r.action, r.plugin);
        var filter = r.action.emitterFilter;

        // console.log('EmitterType: ', r.action.eventType)
        if (_lodash2.default.isRegExp(r.action.eventType)) {
          // console.log("Is REGEX")
          return true;
        }

        if (_lodash2.default.isString(filter)) {
          // if all event types should have this handler
          // => always check for new events
          return filter === '*';
        } else if (_lodash2.default.isArray(filter)) {
          r.action.emitterFilter = filter.filter(function (e) {
            return !_this4.eventsManager.emitters[e];
          });
          return !!r.action.emitterFilter.length;
        } else if (_lodash2.default.isRegExp(filter)) {
          return true;
        }
      });
    }
  }, {
    key: 'attachEventHandler',
    value: function attachEventHandler(emitterName, action, plugin) {
      var _this5 = this;

      // console.log("Attaching Event Handler: ", emitterName, action)

      // consider every type of event emitters
      // handlers for every event
      if (emitterName === '__all__') {
        this.eventsManager.getEmittersArray().forEach(function (emitter) {
          return emitter.events.forEach(function (ename) {
            return (
              // emitter.on(ename, action.func)
              _this5._attachHandler(emitter, ename, action, plugin)
            );
          });
        });
      } else {
        var emitters = this.getEmitters(action);
        // console.log("\nEmitters: ", emitters)
        // no emitters to register action for
        // check AutoRegister status
        if (!emitters.length && !this.__autoRegister__) {
          throw new Error('Cannot register event for unregistered emitter');
        }
        // no emitter, but with AutoRegister option ->
        // save this action registration for the future
        else if (!emitters.length && this.__autoRegister__) return false;

        // regular event register
        this._registerEventHandler(action, emitters, plugin);
      }

      return true;
    }
  }, {
    key: '_attachHandler',
    value: function _attachHandler(emitter, ename, action, plugin) {
      // console.log(chalk.blue("_attachHandler: "), emitter.name, ename, action.emitterFilter, plugin.name, this.__register_table__)
      var hash = plugin.name + ' - ' + emitter.name + ' - ' + ename;
      // console.log(hash)
      // if handler for this plugin and action has already been registered
      if (this.__register_table__.indexOf(hash) > -1) {
        return false;
      }

      this.__register_table__.push(hash);
      // console.log(chalk.green("Regisrering: ", hash))
      // console.log(this.__register_table__)
      // console.log("\n")
      emitter.on(ename, action.func);
      return true;
    }
  }, {
    key: '_registerEventHandler',
    value: function _registerEventHandler(action, eventEmitters, plugin) {
      var _this6 = this;

      var filter = action.eventType;
      // console.log(chalk.red('Filter: '), filter, eventEmitters.length)

      if (_lodash2.default.isString(filter)) {
        // if all event types should have this handler
        if (filter === '*') {
          eventEmitters.forEach(function (emitter) {
            return emitter.events.forEach(function (ename) {
              return (
                // emitter.on(ename, action.func)
                _this6._attachHandler(emitter, ename, action, plugin)
              );
            });
          });
          return;
        }

        eventEmitters.forEach(function (emitter) {
          return (
            // emitter.on(filter, action.func)
            _this6._attachHandler(emitter, filter, action, plugin)
          );
        });
      } else if (_lodash2.default.isArray(filter)) {
        eventEmitters.forEach(function (emitter) {
          return filter.forEach(function (ename) {
            return (
              // emitter.on(ename, action.func)
              _this6._attachHandler(emitter, ename, action, plugin)
            );
          });
        });
      } else if (_lodash2.default.isRegExp(filter)) {
        eventEmitters.forEach(function (emitter) {
          return emitter.events.filter(function (ename) {
            return filter.test(ename);
          }).forEach(function (ename) {
            return _this6._attachHandler(emitter, ename, action, plugin);
          });
        });
      }

      return true;
    }
  }, {
    key: 'getEmitters',
    value: function getEmitters(action) {
      var _this7 = this;

      var filter = action.emitterFilter;

      if (_lodash2.default.isString(filter)) {
        // if all emitters
        if (filter === '*') return this.eventsManager.getEmittersArray();
        // return specific emitter
        return this.eventsManager.emitters[filter] ? [this.eventsManager.emitters[filter]].filter(Boolean) : [];
      } else if (_lodash2.default.isArray(filter)) {
        return filter.map(function (f) {
          return _this7.eventsManager.emitters[f];
        }).filter(Boolean);
      } else if (_lodash2.default.isRegExp(filter)) {
        return this.eventsManager.getEmittersArray().filter(function (e) {
          return filter.test(e.name);
        });
      } else {
        throw new Error('PluginManager::getEmitters : Invalid action');
      }
    }
  }]);

  return PluginManager;
}(_events2.default.EventEmitter);

exports.default = PluginManager;