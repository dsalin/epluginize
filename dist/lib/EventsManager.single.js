'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * A singleton object for controlling systems events
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @namespace/singleton
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


var EventsManager = function (_events$EventEmitter) {
  _inherits(EventsManager, _events$EventEmitter);

  function EventsManager() {
    _classCallCheck(this, EventsManager);

    var _this = _possibleConstructorReturn(this, (EventsManager.__proto__ || Object.getPrototypeOf(EventsManager)).call(this));

    _this.events = {};
    _this.emitters = {};
    return _this;
  }

  _createClass(EventsManager, [{
    key: 'listAllEvents',
    value: function listAllEvents() {
      console.log(this.events);
    }
  }, {
    key: 'getEmittersArray',
    value: function getEmittersArray() {
      var _this2 = this;

      return Object.keys(this.emitters).map(function (name) {
        return _this2.emitters[name];
      });
    }
  }, {
    key: 'addEmitter',
    value: function addEmitter(emitter) {
      if (this.emitters[emitter.name]) {
        console.log('Emitter with that name already exists, OVERRIDING ...');
      }
      this.emitters[emitter.name] = emitter;
      this.emit('Emitter/Registered', emitter);
    }

    // Checks whether the event is already
    // emitted by some EventEmitter or not

  }, {
    key: 'eventIsRegistered',
    value: function eventIsRegistered(title, emitterName) {
      try {
        return !!this.events[emitterName][title];
      } catch (err) {
        return false;
      }
    }
  }, {
    key: 'getEventEmitterName',
    value: function getEventEmitterName(eventType) {
      if (!this.eventIsRegistered(eventType)) return false;
      return this.events[eventType];
    }

    // check whether a particular event is
    // emitted by a particular Event Emitter

  }, {
    key: 'eventEmittedBy',
    value: function eventEmittedBy(title, eventEmitter) {
      if (this.eventIsRegistered(title, eventEmitter.name)) return this.events[eventEmitter.name][title] === eventEmitter;
      return false;
    }
  }, {
    key: 'registerEvent',
    value: function registerEvent(title, eventEmitter) {
      if (this.eventIsRegistered(title, eventEmitter.name)) return false;
      // add event signature with the corresponding
      // emitter object name
      if (!this.events[eventEmitter.name]) this.events[eventEmitter.name] = {};

      this.events[eventEmitter.name][title] = eventEmitter;
      this.emit('Event/Registered', title, eventEmitter);
      return true;
    }
  }]);

  return EventsManager;
}(_events2.default.EventEmitter);

exports.default = new EventsManager();