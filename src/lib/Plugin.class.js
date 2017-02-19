/**
* Plugin class:
*   Hooks to particular event types and
*   does some work on the data provided by those
*   events, if needed
*
* @class
*/

import _ from 'lodash'
import PluginAction from './PluginAction.class'

class Plugin {
  constructor( name ) {
    this.name = name
    this.actions = {
      // actions applied to all events
      __all__: [],
      // actions applied to event emitters filtered by RegExp
      __regx__: []
    }
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
  on( eventType, emitterFilter, func ) {
    const action = new PluginAction(eventType, emitterFilter, func)

    // check all types and type combinations
    if ( eventType === '*' && emitterFilter === '*' ) {
      this.all(action)
    }
    else if ( _.isString(emitterFilter) ) {
      if ( !this.actions[emitterFilter] ) this.actions[emitterFilter] = []
      this.actions[emitterFilter].push(action) 
    }
    else if ( _.isArray(emitterFilter) ) {
      emitterFilter.forEach(emitter => {
        if ( !this.actions[emitter] ) this.actions[emitter] = []
        this.actions[emitter].push(action) 
      })
    } 
    else if ( _.isRegExp(emitterFilter) ) {
      this.actions.__regx__.push(action)
    } 

    return this
  }

  // register function for all events
  // functions will be fired one after another in
  // the order they were registered
  all( action ) {
    this.actions.__all__.push(action)
  }

  onAll( func ) {
    const action = new PluginAction('*', '*', func)
    return this.all(action)
  }
}

export default Plugin
