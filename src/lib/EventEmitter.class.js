/**
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

import events from 'events'
import EventsManager from './EventsManager.single'

class EventEmitter extends events.EventEmitter {
  constructor( name ) {
    super()
    this.name = name
    this.events = []
    // for speeding up the search
    this.__events__ = {}
    this.registerSelf()
  }

  // Create multiple event emitters at once
  static mult( emitterNames ) {
    if ( !Array.isArray(emitterNames) )
      throw new Error('Argument to `EventEmitter.mult` should be an Array')

    return emitterNames.map(n => new EventEmitter(n))
  }

  // checks whether a particular event can be fired
  // by this EventEmitter
  canEmit( title ) {
    return !!this.__events__[title]
  }

  registerSelf() {
    EventsManager.addEmitter(this)
  }

  registerEvent( title ) {
    // push event title to events list only if EventsManager
    // accepts the event and varifies that no collisions exist
    // pushing to events list is done 
    if ( !EventsManager.eventIsRegistered(title, this.name) ) {
      this.events.push(title)
      this.__events__[title] = true
      EventsManager.registerEvent(title, this)

      return true
    }

    return false
  }

  registerEvents( enames ) {
    enames.forEach(e => this.registerEvent(e))
  }

  limitListenersTo( limit ) {
    this.setMaxListeners(limit)
  }

  // override emitting logic in order to force only
  // registered events to be fired
  emit( ...params ) {
    if ( !this.canEmit(params[0]) )
      throw new Error('You cannot emit unregistered event')
    // emit the event, setting `eventName` and `emitterName`
    // as the last two params passed
    else super.emit.apply(this, params.concat([params[0], this.name]))
  }

  // asynchronously emit event
  emitAsync( ...params ) {
    if ( !this.canEmit(params[0]) )
      throw new Error('You cannot emit unregistered event')
    // emit the event, setting `eventName` and `emitterName`
    // as the last two params passed
    else setImmediate(() => super.emit.apply(this, params.concat([params[0], this.name])))
  }
}

export default EventEmitter
