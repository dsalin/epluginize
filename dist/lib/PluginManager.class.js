'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PluginManager = function () {
  function PluginManager(plugins, eventsManager) {
    _classCallCheck(this, PluginManager);

    this.plugins = plugins;
    this.eventsManager = eventsManager;
    this.registerPlugins();

    this.eventsManager.getEmittersArray().forEach(function (e) {
      return console.log(e.name, ": ", e.events);
    });
  }

  _createClass(PluginManager, [{
    key: 'registerPlugins',
    value: function registerPlugins() {
      var _this = this;

      console.log(_chalk2.default.green('Registering Plugins ...'), this.plugins.map(function (p) {
        return p.name;
      }));
      this.plugins.forEach(function (plugin) {
        return _this.registerPlugin(plugin);
      });
    }
  }, {
    key: 'registerPlugin',
    value: function registerPlugin(plugin) {
      var _this2 = this;

      Object.keys(plugin.actions).forEach(function (emitterName) {
        return plugin.actions[emitterName].forEach(function (action) {
          if (!_this2.attachEventHandler(emitterName, action)) throw new Error('Cannot register all actions for plugin: ' + plugin.name);
        });
      });
    }
  }, {
    key: 'attachEventHandler',
    value: function attachEventHandler(emitterName, action) {
      // console.log("Attaching Event Handler: ", emitterName, action)

      // consider every type of event emitters
      // handlers for every event
      if (emitterName === '__all__') {
        this.eventsManager.getEmittersArray().forEach(function (emitter) {
          return emitter.events.forEach(function (ename) {
            return emitter.on(ename, action.func);
          });
        });
      }
      // handlers for emitters matching specific RegExp
      else if (emitterName === '__regx__') {
          var emitters = this.getEmitters(action);
          this.registerEventHandler(action, emitters);
        } else {
          var _emitters = this.getEmitters(action);
          this.registerEventHandler(action, _emitters);
        }

      return true;
    }
  }, {
    key: 'registerEventHandler',
    value: function registerEventHandler(action, eventEmitters) {
      var filter = action.eventType;

      if (_lodash2.default.isString(filter)) {
        // if all event types should have this handler
        if (filter === '*') {
          eventEmitters.forEach(function (emitter) {
            return emitter.events.forEach(function (ename) {
              return emitter.on(ename, action.func);
            });
          });
          return;
        }

        eventEmitters.forEach(function (emitter) {
          return emitter.on(filter, action.func);
        });
      } else if (_lodash2.default.isArray(filter)) {
        eventEmitters.forEach(function (emitter) {
          return filter.forEach(function (ename) {
            return emitter.on(ename, action.func);
          });
        });
      } else if (_lodash2.default.isRegExp(filter)) {
        eventEmitters.forEach(function (emitter) {
          return emitter.events.filter(function (ename) {
            return filter.test(ename);
          }).forEach(function (ename) {
            return emitter.on(ename, action.func);
          });
        });
      }
    }
  }, {
    key: 'getEmitters',
    value: function getEmitters(action) {
      var _this3 = this;

      var filter = action.emitterFilter;

      if (_lodash2.default.isString(filter)) {
        // if all emitters
        if (filter === '*') return this.eventsManager.getEmittersArray();
        // return specific emitter
        return [this.eventsManager.emitters[filter]];
      } else if (_lodash2.default.isArray(filter)) {
        return filter.map(function (f) {
          return _this3.eventsManager.emitters[f];
        }).filter(Boolean);
      } else if (_lodash2.default.isRegExp(filter)) {
        return this.eventsManager.getEmittersArray().filter(function (e) {
          return filter.test(e.name);
        });
      }
    }
  }]);

  return PluginManager;
}();

exports.default = PluginManager;