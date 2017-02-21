/**
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

import _ from 'lodash'
import events from 'events'
import EventsManager from './EventsManager.single'

class PluginManager extends events.EventEmitter {
  constructor( plugins, eventsManager, auto = false ) {
    super()
    this.plugins = plugins
    this.__plugins__ = {}
    this.eventsManager = eventsManager || EventsManager

    // data containers for AutoRegister option
    this.__autoRegister__ = auto
    this.__auto__ = []
    this.__register_table__ = []

    // do not register plugins immediately if
    // autoRegister option is provied
    if ( !auto ) this.registerPlugins()

    // Register event handlers
    this.eventsManager.on('Emitter/Registered', emitter => {
      this.checkUnregistered(emitter.name)
    })

    this.eventsManager.on('Event/Registered', (title, emitter) => {
      this.checkUnregistered(emitter.name, title)
    })
  }

  addPlugin( plugin ) {
    this.plugins.push(plugin)
    this.__plugins__[plugin.name] = plugin

    this.emit('Plugin/Registered')
    return this
  }

  registerPlugins() {
    console.log(chalk.green('Registering Plugins ...'), this.plugins.map(p => p.name))
    this.plugins.forEach(plugin => this.registerPlugin(plugin))
    return this
  }

  // Attach necessary handlers to event emitters
  registerPlugin( plugin ) {
    let allRegistered = true

    Object.keys(plugin.actions).forEach(emitterName =>
      plugin.actions[emitterName].forEach(action => {
        if ( !this.attachEventHandler(emitterName, action, plugin) ) allRegistered = false
      })
    )

    if ( !allRegistered )
        throw new Error(`Cannot register all actions for plugin: ${plugin.name}`)

    return this
  }

  /**
  * Automatically register Plugin action
  * Note: can throw error
  * 
  * @can-error
  */
  autoRegisterAction( type, action, plugin ) {
    this.attachEventHandler(type, action, plugin)
    this.__auto__.push({ type, action, plugin })
  }

  checkUnregistered( emitterName, title ) {
    this.__auto__ = this.__auto__.filter(r => {
      this.attachEventHandler(r.type, r.action, r.plugin)
      const filter = r.action.emitterFilter

      // always check event types with RegExp
      if ( _.isRegExp(r.action.eventType) ) return true

      if ( _.isString(filter) ) {
        // if all event types should have this handler
        // => always check for new events
        return filter === '*'
      }
      else if ( _.isArray(filter) ) {
        r.action.emitterFilter = filter.filter(e => !this.eventsManager.emitters[e])
        return !!r.action.emitterFilter.length
      }
      else if ( _.isRegExp(filter) ) {
        return true
      }
    })
  }

  attachEventHandler( emitterName, action, plugin ) {
    // consider every type of event emitters
    // handlers for every event
    if ( emitterName === '__all__' ) {
      this.eventsManager.getEmittersArray()
        .forEach(emitter =>
          emitter.events.forEach(ename =>
            this._attachHandler(emitter, ename, action, plugin))
        )
    }
    else {
      let emitters = this.getEmitters(action)
      // no emitters to register action for
      // check AutoRegister status
      if ( !emitters.length && !this.__autoRegister__ )
        throw new Error('Cannot register event for unregistered emitter')
      // no emitter, but with AutoRegister option ->
      // save this action registration for the future
      else if ( !emitters.length && this.__autoRegister__ ) return false

      // regular event register
      this._registerEventHandler(action, emitters, plugin)
    }

    return true
  }

  _attachHandler(emitter, ename, action, plugin) {
    const hash = `${plugin.name} - ${emitter.name} - ${ename}`
    // if handler for this plugin and action has already been registered
    if (this.__register_table__.indexOf(hash) > -1) return false
    
    this.__register_table__.push(hash)
    emitter.on(ename, action.func)
    return true
  }

  _registerEventHandler(action, eventEmitters, plugin) {
    const filter = action.eventType

    if ( _.isString(filter) ) {
      // if all event types should have this handler
      if ( filter === '*' ) {
        eventEmitters.forEach(emitter => 
          emitter.events.forEach(ename => 
            this._attachHandler(emitter, ename, action, plugin))
        )
        return
      }

      eventEmitters.forEach(emitter => 
        this._attachHandler(emitter, filter, action, plugin))
    }
    else if ( _.isArray(filter) ) {
      eventEmitters.forEach(emitter => 
        filter.forEach(ename => 
          // emitter.on(ename, action.func)
          this._attachHandler(emitter, ename, action, plugin)
        )
      )
    }
    else if ( _.isRegExp(filter) ) {
      eventEmitters.forEach(emitter =>
        emitter.events
        .filter(ename => filter.test(ename))
        .forEach(ename => 
          this._attachHandler(emitter, ename, action, plugin)
        )
      )
    }

    return true
  }

  getEmitters( action ) {
    const filter = action.emitterFilter

    if ( _.isString(filter) ) {
      // if all emitters
      if ( filter === '*' ) return this.eventsManager.getEmittersArray()
      // return specific emitter
      return this.eventsManager.emitters[filter]
        ? [this.eventsManager.emitters[filter]].filter(Boolean)
        : []
    }
    else if ( _.isArray(filter) ) {
      return filter.map(f => this.eventsManager.emitters[f]).filter(Boolean)
    }
    else if ( _.isRegExp(filter) ) {
      return this.eventsManager.getEmittersArray().filter(e => filter.test(e.name))
    }
    else {
      throw new Error('PluginManager::getEmitters : Invalid action')
    }
  }
}

export default PluginManager
