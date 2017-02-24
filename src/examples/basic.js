import EPL from '../index.js'

// configure to AutoRegister plugins as they are constructed
EPL.Plugin.autoRegister()

// create basic event emitters
const sessionEmitter = new EPL.EventEmitter('Session')

// register events
sessionEmitter.registerEvents(['Initialized', 'Destroyed'])

// create simple plugin
const simpleLogger = new EPL.Plugin('Logger')

// Listen for `Initialized` and 'Destroyed' events from 'Session' emitter
simpleLogger.on(['Initialized', 'Destroyed'], 'Session', data => 
  console.log("SimpleLogger (Session Initialized):", data)
)

sessionEmitter.emit('Initialized', 'example.txt')
