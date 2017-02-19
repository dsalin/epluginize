/**
* A singleton object for controlling systems events
*
* @namespace/singleton
*/

class EventsManager {
  constructor() {
    this.events = {}
    this.emitters = {}
  }

  listAllEvents() {
    console.log(this.events)
  }

  getEmittersArray() {
    return Object.keys(this.emitters)
      .map(name => this.emitters[name])
  }

  addEmitter( emitter ) {
    if ( this.emitters[emitter.name] ) {
      console.log('Emitter with that name already exists, OVERRIDING ...')
    }
    this.emitters[emitter.name] = emitter
  }

  // Checks whether the event is already
  // emitted by some EventEmitter or not
  eventIsRegistered( title, emitterName ) {
    try {
      return !!this.events[emitterName][title]
    } catch (err) {
      return false
    }
  }

  getEventEmitterName( eventType ) {
    if ( !this.eventIsRegistered(eventType) ) return false
    return this.events[eventType]
  }

  // check whether a particular event is
  // emitted by a particular Event Emitter
  eventEmittedBy( title, eventEmitter ) {
    if ( this.eventIsRegistered(title, eventEmitter.name) )
      return this.events[eventEmitter.name][title] === eventEmitter
    return false
  }

  registerEvent( title, eventEmitter ) {
    if ( this.eventIsRegistered(title, eventEmitter.name) ) return false
    // add event signature with the corresponding
    // emitter object name
    if ( !this.events[eventEmitter.name] )
      this.events[eventEmitter.name] = {}

    this.events[eventEmitter.name][title] = eventEmitter
    return true
  }
}

export default new EventsManager
