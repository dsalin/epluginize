# EPluginize ( in Development )
Convenient event-based plugin system for NodeJS projects.
Note that this package as well as this README are still in development and not stable right now.
Thank you.

## Summary
EventEmitters have been in Node since the beginning of time and are an extremely convenient way of
decoupling different aspects of your application. EPluginize is trying to add another layer of convenience
and make it truly fun working with NodeJS events, without sacrificing their power.
In this Guide, we will go from the most basic usage to the advanced techniques that some might (and hopefully will) need in their projects.

## Installation
```js
// save to your dependencies
npm i epluginize -S
```

## Important difference from standard Pub/Sub
`EPluginize` is using **Pub/Sub** logic, no question here. However, **the way you register** your handlers is different.
With regular NodeJS EventEmitters, you actually need an EventEmitter object to attach your event handlers, one at a time.
Furthermore, this EventEmitter should be defined before you can actually register anything. This introduces small (but still tedious)
process to follow, especially when working with other developers.

Therefore, `EPluginize` allows you to:
    - Register Event Handlers before you actually register EventEmitters, so that you don't ever need to worry about the correct order of those
    - Register Event Handlers for multiple EventEmitters and multiple events in one command
    - Register Event Handlers for Future Events (the ones that you dont know for sure), so your handlers start working just after new Event Type is registered
    - Register Plugin Events, where Plugins themselves can emit events with all the functionality described above
    - etc.

### Basic Usage (Really basic :P)
Here we create 2 Plugins that listen for certain events from certain event emitters.
**Important:** in EPluginize, **all events must be registered before emitted**.
This gives more control, especially in huge projects.

```js
import EPL from 'epluginize'

// configure to AutoRegister plugins as they are constructed
// more on this later
EPL.Plugin.autoRegister()

// create basic event emitters
const sessionEmitter = new EPL.EventEmitter('Session')
const fileEmitter = new EPL.EventEmitter('File')

// register their events
sessionEmitter.registerEvents(['Initialized', 'Destroyed'])
fileEmitter.registerEvents(['Initialized', 'Destroyed'])

// create simple plugin
const simpleLogger = new EPL.Plugin('Logger')
const simpleSaver = new EPL.Plugin('Saver')

// Listen for `Initialized` event from 'Session' emitter
simpleLogger.on('Initialized', 'Session', data => {
  console.log("SimpleLogger (Session Initialized): ", data)
})

// Listen for `Destroyed` event from 'File' emitter
simpleSaver.on('Destroyed', 'File', data => {
  console.log("SimpleSaver (File Destroyed): ", data)
})

// Listen for `Initialized` event from 'File' emitter
simpleLogger.on('Initialized', 'File', data => {
  console.log("SimpleLogger (File Initialized): ", data)
})

sessionEmitter.emit('Initialized')
fileEmitter.emit('Destroyed')
```

As you can see here, we just create 2 EventEmitters and 2 Plugins that have different handlers attached to events.

### Basic Usage with Advanced 
Here we create 2 Plugins that listen for certain events from certain event emitters.
**Important:** in EPluginize, **all events must be registered before emitted**.
This gives more control, especially in huge projects.

```js
import EPL from 'epluginize'

// configure to AutoRegister plugins as they are constructed
// more on this later
EPL.Plugin.autoRegister()

// create basic event emitters
const sessionEmitter = new EPL.EventEmitter('Session')
const fileEmitter = new EPL.EventEmitter('File')

// register their events
sessionEmitter.registerEvents(['Initialized', 'Destroyed'])
fileEmitter.registerEvents(['Initialized', 'Destroyed'])

// create simple plugin
const simpleLogger = new EPL.Plugin('Logger')
const simpleSaver = new EPL.Plugin('Saver')

// Listen for all events from 'Session' emitter
simpleLogger.on('*', 'Session', data => {
  console.log("SimpleLogger (Session Initialized): ", data)
})

// Listen for `Initialized` and `Destroyed` events from 'File' emitter
simpleSaver.on(['Initialized', 'Destroyed]', 'File', data => {
  console.log("SimpleSaver (File Initialized or Destroyed): ", data)
})

// Listen for `Initialized` and `Destroyed` events from 'File' and 'Session' emitters
simpleSaver.on(['Initialized', 'Destroyed]', ['File', 'Session'], data => {
  console.log("SimpleSaver (File Initialized or Destroyed): ", data)
})

sessionEmitter.emit('Initialized')
fileEmitter.emit('Destroyed')
```

### TODO:
    - Add EmitAsync method to event emitter -- Done
    - Plugins subscribe to plugins -- Done
    - Check multiple plugins listening for a particular event and throwing an error ( one of them might not be registered ) -- Done
    - AutoRegister -- Done only for events, not event emitters

    - Production/Development Modes
    - Execute event handler after another handler finished
        (ex: Sync plugin chaged state -> Notification plugin kicks in after that to send some stuff)
    - Adding checks to event executions (i.e, provide function that checks whether event should or should not be executed)
    - Allow unregistered events to be fired (provide options object for that)
