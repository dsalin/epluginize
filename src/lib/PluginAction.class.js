
class PluginAction {
  constructor( type, emitter, func ) {
    this.eventType = type
    this.emitterFilter = emitter
    this.func = func
  }

  run( ...params ) {
    return this.func.apply(null, params)
  }
}

export default PluginAction
