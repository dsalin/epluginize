/**
* Plugin class:
*   Hooks to particular event types and
*   does some work on the data provided by those
*   events, if needed
*
* @class
*/

import _ from 'lodash'
import PluginManager from './PluginManager.class'
import PluginAction from './PluginAction.class'
import EventEmitter from './EventEmitter.class'

class Plugin extends EventEmitter {
  constructor( name ) {
    super(name)

    this.actions = {
      // actions applied to all events
      __all__: [],
      // actions applied to event emitters filtered by RegExp
      __regx__: []
    }

    if ( Plugin.__autoRegister__ && Plugin.PluginManager )
      Plugin.PluginManager.addPlugin(this)
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
    // EventEmitter register event
    if ( arguments.length === 2 ) {
      super.on(arguments[0], arguments[1])
      return this
    }

    const action = new PluginAction(eventType, emitterFilter, func)
    let type = emitterFilter

    // check all types and type combinations
    if ( eventType === '*' && emitterFilter === '*' ) {
      this.all(action)
      type = '__all__'
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
      type = '__regx__'
    } 

    // autoregister Plugin
    if ( Plugin.autoRegister && Plugin.pluginManager ) {
      Plugin.pluginManager.autoRegisterAction(type, action, this)
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

  static autoRegister() {
    /**
    * Create shared PluginManager
    * to be used with all instances of Plugin Class.
    * 
    * Note: this is done since no explicit calls to PluginManager
    * are made with autoRegister option enabled. Therefore, a mechanism
    * of sharing PluginManager instance should be established.
    */
    Plugin.pluginManager = new PluginManager([], null, true)
    Plugin.__autoRegister__ = true
  }
}

// Indicates whether Plugins should automatically
// register themselves on construction, or wait for
// a global PluginManager.registerPlugins method to be called
Plugin.__autoRegister__ = false

export default Plugin
