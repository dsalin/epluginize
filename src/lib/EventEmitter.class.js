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
    this.registerSelf()
  }

  // checks whether a particular event can be fired
  // by this EventEmitter
  canEmit( title ) {
    return this.events.indexOf(title) >= 0
  }

  registerSelf() {
    EventsManager.addEmitter(this)
  }

  registerEvent( title ) {
    // push event title to events list only if EventsManager
    // accepts the event and varifies that no collisions exist
    if ( EventsManager.registerEvent(title, this) ) {
      this.events.push(title)
      return true
    }

    return false
  }

  limitListenersTo( limit ) {
    this.setMaxListeners(limit)
  }

  // override emitting logic in order to force only
  // registered events to be fired
  emit( ...params ) {
    if ( !this.canEmit(params[0]) )
      throw new Error('You cannot emit unregistered event')
    else super.emit.apply(this, params)
  }

  // asynchronously emit event
  emitAsync( ...params ) {
    if ( !this.canEmit(params[0]) )
      throw new Error('You cannot emit unregistered event')
    else setImmediate(() => super.emit.apply(this, params))
  }
}

export default EventEmitter
