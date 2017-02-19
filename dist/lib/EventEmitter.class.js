'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _EventsManager = require('./EventsManager.single');

var _EventsManager2 = _interopRequireDefault(_EventsManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * EventEmitter class:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *   Is responsible for emitting/firing events of
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *   various types in order to notify subscribed modules.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *   Should be subclassed.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *   Provides API for the modules to interact with events.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * TODO: listen for EventManager `delete event type` event,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * to keep up to date with the supported events
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var EventEmitter = function (_events$EventEmitter) {
  _inherits(EventEmitter, _events$EventEmitter);

  function EventEmitter(name) {
    _classCallCheck(this, EventEmitter);

    var _this = _possibleConstructorReturn(this, (EventEmitter.__proto__ || Object.getPrototypeOf(EventEmitter)).call(this));

    _this.name = name;
    _this.events = [];
    _this.registerSelf();
    return _this;
  }

  // checks whether a particular event can be fired
  // by this EventEmitter


  _createClass(EventEmitter, [{
    key: 'canEmit',
    value: function canEmit(title) {
      return this.events.indexOf(title) >= 0;
    }
  }, {
    key: 'registerSelf',
    value: function registerSelf() {
      _EventsManager2.default.addEmitter(this);
    }
  }, {
    key: 'registerEvent',
    value: function registerEvent(title) {
      // push event title to events list only if EventsManager
      // accepts the event and varifies that no collisions exist
      if (_EventsManager2.default.registerEvent(title, this)) {
        this.events.push(title);
        return true;
      }

      return false;
    }
  }, {
    key: 'limitListenersTo',
    value: function limitListenersTo(limit) {
      this.setMaxListeners(limit);
    }

    // override emitting logic in order to force only
    // registered events to be fired

  }, {
    key: 'emit',
    value: function emit() {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      if (!this.canEmit(params[0])) throw new Error('You cannot emit unregistered event');else _get(EventEmitter.prototype.__proto__ || Object.getPrototypeOf(EventEmitter.prototype), 'emit', this).apply(this, params);
    }

    // asynchronously emit event

  }, {
    key: 'emitAsync',
    value: function emitAsync() {
      var _this2 = this;

      for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      if (!this.canEmit(params[0])) throw new Error('You cannot emit unregistered event');else setImmediate(function () {
        return _get(EventEmitter.prototype.__proto__ || Object.getPrototypeOf(EventEmitter.prototype), 'emit', _this2).apply(_this2, params);
      });
    }
  }]);

  return EventEmitter;
}(_events2.default.EventEmitter);

exports.default = EventEmitter;