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
import chalk from 'chalk'

class PluginManager {
  constructor( plugins, eventsManager ) {
    this.plugins = plugins
    this.eventsManager = eventsManager
    this.registerPlugins()

    this.eventsManager.getEmittersArray()
      .forEach(e => console.log(e.name, ": ", e.events))
  }

  registerPlugins() {
    console.log(chalk.green('Registering Plugins ...'), this.plugins.map(p => p.name))
    this.plugins.forEach(plugin => this.registerPlugin(plugin))
  }

  registerPlugin( plugin ) {
    Object.keys(plugin.actions).forEach(emitterName =>
      plugin.actions[emitterName].forEach(action => {
        if ( !this.attachEventHandler(emitterName, action) )
          throw new Error(`Cannot register all actions for plugin: ${plugin.name}`)
      })
    )
  }

  attachEventHandler( emitterName, action ) {
    // console.log("Attaching Event Handler: ", emitterName, action)

    // consider every type of event emitters
    // handlers for every event
    if ( emitterName === '__all__' ) {
      this.eventsManager.getEmittersArray()
        .forEach(emitter =>
          emitter.events.forEach(ename => emitter.on(ename, action.func))
        )
    }
    // handlers for emitters matching specific RegExp
    else if ( emitterName === '__regx__' ) {
      let emitters = this.getEmitters(action)
      this.registerEventHandler(action, emitters)
    }
    else {
      let emitters = this.getEmitters(action)
      this.registerEventHandler(action, emitters)
    }

    return true
  }

  registerEventHandler(action, eventEmitters) {
    const filter = action.eventType

    if ( _.isString(filter) ) {
      // if all event types should have this handler
      if ( filter === '*' ) {
        eventEmitters.forEach(emitter => 
          emitter.events.forEach(ename => emitter.on(ename, action.func))
        )
        return
      }

      eventEmitters.forEach(emitter =>
        emitter.on(filter, action.func)
      )
    }
    else if ( _.isArray(filter) ) {
      eventEmitters.forEach(emitter => 
        filter.forEach(ename => emitter.on(ename, action.func))
      )
    }
    else if ( _.isRegExp(filter) ) {
      eventEmitters.forEach(emitter => 
        emitter.events.filter(ename => filter.test(ename))
          .forEach(ename => emitter.on(ename, action.func))
      )
    }
  }

  getEmitters( action ) {
    const filter = action.emitterFilter

    if ( _.isString(filter) ) {
      // if all emitters
      if ( filter === '*' ) return this.eventsManager.getEmittersArray()
      // return specific emitter
      return [this.eventsManager.emitters[filter]]
    }
    else if ( _.isArray(filter) ) {
      return filter.map(f => this.eventsManager.emitters[f]).filter(Boolean)
    }
    else if ( _.isRegExp(filter) ) {
      return this.eventsManager.getEmittersArray().filter(e => filter.test(e.name))
    }
  }
}

export default PluginManager
