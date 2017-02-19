'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* A singleton object for controlling systems events
*
* @namespace/singleton
*/

var EventsManager = function () {
  function EventsManager() {
    _classCallCheck(this, EventsManager);

    this.events = {};
    this.emitters = {};
  }

  _createClass(EventsManager, [{
    key: 'listAllEvents',
    value: function listAllEvents() {
      console.log(this.events);
    }
  }, {
    key: 'getEmittersArray',
    value: function getEmittersArray() {
      var _this = this;

      return Object.keys(this.emitters).map(function (name) {
        return _this.emitters[name];
      });
    }
  }, {
    key: 'addEmitter',
    value: function addEmitter(emitter) {
      if (this.emitters[emitter.name]) {
        console.log('Emitter with that name already exists, OVERRIDING ...');
      }
      this.emitters[emitter.name] = emitter;
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
      return true;
    }
  }]);

  return EventsManager;
}();

exports.default = new EventsManager();