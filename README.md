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

## Table of contents

- [Important difference from standard Pub/Sub](#important-difference-from-standard-Pub/Sub)
- [Basic Usage](#basic-usage)
- [What You See is what You Get](#what-you-see-is-what-you-get)
- [API Overview](#api-overview)
- [Notes](#notes)

## Important difference from standard Pub/Sub

`EPluginize` is using **Pub/Sub** logic, no question here. However, **the way you register** your handlers is different.
With regular NodeJS EventEmitters, you actually need an EventEmitter object to attach your event handlers, one at a time.
Furthermore, this EventEmitter should be defined before you can actually register anything. This introduces small (but still tedious)
process to follow, especially when working with other developers.

Therefore, `EPluginize` mainly allows you to:

    - Register Event Handlers before you actually register EventEmitters, so that you don't ever need to worry about the correct order of those
    - Register Event Handlers for multiple EventEmitters and multiple events in one command
    - Register Event Handlers for Future Events (the ones that you dont know for sure), so your handlers start working just after new Event Type is registered
    - Register Plugin Events, where Plugins themselves can emit events with all the functionality described above

## Basic Usage

Here we create a Plugin that listens for 2 events from an event emitter and simply logs the results.
**Important:** in EPluginize, **all events must be registered before emitted**.
This gives more control, especially in huge projects.

```js
// src/examples/basic.js

import EPL from 'epluginize'

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
```

You should see this output:

```bash
# Output

SimpleLogger (Session Initialized): example.txt
```

Pretty expected, now lets move to the fun part.

## What You See is what You Get

We've already covered the basic usage. Frankly, so far it made almost no difference from regular EventEmitters exposed
by NodeJS. Therefore, in this section we will throw all the perks and see what happens.

### Different Events/Emitter Selection

```js
// src/examples/selectors.js

import EPL from 'epluginize'

// create basic event emitters
const [ E1, E2 ] = EPL.EventEmitter.mult(['E1', 'E2'])

// register their events
E1.registerEvents(['Initialized', 'Destroyed'])
E2.registerEvents(['Initialized', 'Destroyed'])

// create plugins
// Note: in AutoRegister mode, plugins cannot have 
// multiple handlers for the same events, that is why we create
// a couple more plugins to show the whole power of selectors
const [ P1, P2, P3, P4 ] = EPL.Plugin.mult(['P1', 'P2', 'P3', 'P4'])

// Listen for all events from 'E1' emitter
P1.on('*', 'E1', data => 
  console.log("Plugin1 - Emitter1 :", data)
)

// Listen for `Initialized` event from All emitters
P2.on('Initialized', '*', data => 
  console.log("Plugin2 - All Emitters:", data)
)

// Did I say we can use RegEx?
// Listen for `Initialized` and `Destroyed` events from emtters that match the RegEx
// Tip: THAT COVERS EVENT EMITTERS CREATED IN THE FUTURE AS WELL! (more on that in the next example)
P3.on(['Initialized', 'Destroyed'], /E/, data => 
  console.log("Plugin3 - Event from /E/ matching emitters: ", data)
)

// Did I say we can use RegEx everywhere?
// Listen for events matching /ed/ from emtters that match the /E/
P4.on(/ed/, /E/, data => 
  console.log("Plugin4 - Event /ed/ from /E/ matching emitters: ", data)
)

E1.emit('Initialized', 'Emitter1')
E2.emit('Initialized', 'Emitter1')
E2.emit('Destroyed', 'Emitter2')
```

You should see this output:
```bash
# Output

Plugin1 - Emitter1 : Emitter1
Plugin2 - All Emitters: Emitter1
Plugin3 - Event from /E/ matching emitters:  Emitter1
Plugin4 - Event /ed/ from /E/ matching emitters:  Emitter1
Plugin2 - All Emitters: Emitter1
Plugin3 - Event from /E/ matching emitters:  Emitter1
Plugin4 - Event /ed/ from /E/ matching emitters:  Emitter1
Plugin3 - Event from /E/ matching emitters:  Emitter2
Plugin4 - Event /ed/ from /E/ matching emitters:  Emitter2
```

### Future Events and Emitters

Here we register event handlers before we even know exactly
what events will be available in the future.

```js
// src/examples/future.js
import EPL from 'epluginize'

// create basic event emitters
const [ E1, E2 ] = EPL.EventEmitter.mult(['E1', 'E2'])

// create plugins
// Note: in AutoRegister mode, plugins cannot have 
// multiple handlers for the same events, that is why we create
// a couple more plugins to show the whole power of selectors
const [ P1, P2, P3, P4 ] = EPL.Plugin.mult(['P1', 'P2', 'P3', 'P4'])

// For convenience, this refers to plugin object itself, so you don't
// need to worry about those
P1.on('*', 'E1', function (data, eventName, emitterName) {
  console.log(this.name, "Emitter1 :", data, ' | Emitter: ', emitterName, ' | Event:', eventName)
})

P2.on('Initialized', '*', function(data, eventName, emitterName) {
  console.log(this.name, "- All Emitters:", data, ' | Emitter: ', emitterName, ' | Event:', eventName)
})

P3.on(['Initialized', 'Destroyed'], /E/, function(data, eventName, emitterName) {
  console.log(this.name, "- Event from /E/: ", data, ' | Emitter:', emitterName, ' | Event:', eventName)
})

P4.on(/ed/, /E/, function(data, eventName, emitterName) {
  console.log(this.name, "- Event /ed/ from /E/: ", data, ' | Emitter:', emitterName, 'Event:', eventName)
})

// register events after AFTER event handlers
// this can be done in a separate file as well
E1.registerEvents(['Initialized', 'Destroyed'])
E2.registerEvents(['Initialized', 'Destroyed'])

// Emit all the events
E1.emit('Initialized', 'Some Data')
E2.emit('Initialized', 'Some Other Data')
E2.emit('Destroyed', 'Without Errors')

```

You should see this output:
```bash
# Output

P2 - All Emitters: Some Data  | Emitter:  E1  | Event: Initialized
P3 - Event from /E/:  Some Data  | Emitter: E1  | Event: Initialized
P1 Emitter1 : Some Data  | Emitter:  E1  | Event: Initialized
P4 - Event /ed/ from /E/:  Some Data  | Emitter: E1 Event: Initialized
P2 - All Emitters: Some Other Data  | Emitter:  E2  | Event: Initialized
P3 - Event from /E/:  Some Other Data  | Emitter: E2  | Event: Initialized
P4 - Event /ed/ from /E/:  Some Other Data  | Emitter: E2 Event: Initialized
P3 - Event from /E/:  Without Errors  | Emitter: E2  | Event: Destroyed
P4 - Event /ed/ from /E/:  Without Errors  | Emitter: E2 Event: Destroyed
```

Note that it does not matter where to define all of the above.
Let's have an example for that as well:

```js
// src/examples/in-separate-files/plugins.js
import EPL from 'epluginize'

const [ P1, P2, P3, P4 ] = EPL.Plugin.mult(['P1', 'P2', 'P3', 'P4'])

// For convenience, this refers to plugin object itself, so you don't
// need to worry about those
P1.on('*', 'E1', function (data, eventName, emitterName) {
  console.log(this.name, "Emitter1 :", data, ' | Emitter: ', emitterName, ' | Event:', eventName)
})

P2.on('Initialized', '*', function(data, eventName, emitterName) {
  console.log(this.name, "- All Emitters:", data, ' | Emitter: ', emitterName, ' | Event:', eventName)
})

P3.on(['Initialized', 'Destroyed'], /E/, function(data, eventName, emitterName) {
  console.log(this.name, "- Event from /E/: ", data, ' | Emitter:', emitterName, ' | Event:', eventName)
})

P4.on(/ed/, /E/, function(data, eventName, emitterName) {
  console.log(this.name, "- Event /ed/ from /E/: ", data, ' | Emitter:', emitterName, 'Event:', eventName)
})

```js
// src/examples/in-separate-files/emitters.js
import EPL from 'epluginize'

// plugins file has to be executed somehow
// that is why we import it here
// you can use any other method to execute plugin code
import plugins from './plugins'

// create basic event emitters
const [ E1, E2 ] = EPL.EventEmitter.mult(['E1', 'E2'])

// register events after AFTER event handlers
E1.registerEvents(['Initialized', 'Destroyed'])
E2.registerEvents(['Initialized', 'Destroyed'])

// Emit all the events
E1.emit('Initialized', 'Some Data')
E2.emit('Initialized', 'Some Other Data')
E2.emit('Destroyed', 'Without Errors')
```

### Plugins as EventEmitters

Plugins are also EventEmitters, therefore, you can ignore creating the latter altogether.

```js
// src/examples/plugins-as-emitters.js
import EPL from 'epluginize'

// construct plugins
const first = new EPL.Plugin('First')
const second = new EPL.Plugin('Second')
const main = new EPL.Plugin('Main')

first.registerEvent('Initialized')
second.registerEvent('Initialized')

second.on('Initialized', 'First', () => console.log("SECOND: First Plugin has initialized"))
first.on('Initialized', 'Second', () => console.log("FIRST: Second Plugin has initialized"))
main.onAll(pname => console.log(`MAIN: Plugin ${pname} has initialized`))

first.emit('Initialized', 'First')
second.emit('Initialized', 'Second')
```

You should see this output:
```bash
# Output

SECOND: First Plugin has initialized
MAIN: Plugin First has initialized
FIRST: Second Plugin has initialized
MAIN: Plugin Second has initialized
```

## API Overview

### Plugin
The essential part of this package. Plugin is basically an EventEmitter with a collection
of event handlers for other EventEmitters.

In `EPluginize`, you don't register events on emitters that emit those events (as it is usually done).
Instead, you register Emitters (Plugins or EventEmitters) and events that they can emit, later, you define
your plugins that are responsible for handling those events, without touching event emitters directly.

This decoupling simplifies the workflow and enables registering handlers for a lot of emitters using methods
defined in above examples.


`Plugin.prototype**.on(eventSelector, emitterSelector, handler)**`

Register handler for `eventSelector` events, emitted by `emitterSelector` emitters.

**eventSelector** and **emitterSelector** can be a `String`, `Array` or a `RegEx` object.

Note: when using `String` to define above parameters: `*` string denotes `all`.

**func** is a function that takes:

    - `arguments` - arguments that emitter passes when emits the event: (ex: `emitter.emit('event', data)`)
    - `eventName` - `String` describing the name of the event being emitted
    - `emitterName` - `String` describing the name of the event emitter that emits the event

Last two parameters can be useful for cases, when you register a handler for multiple event emitters or multiple events.
This helps distinguish between those, if needed.


`Plugin.prototype**.onAll(handler)**`

Register emitter for all events emitted by all event emitters.


`Plugin**.mult([ names ])**`

Create multiple Plugins with given array of names.


### EventEmitter

`EventEmitter.prototype**.emit(eventName, params)**`

Emit registered event with a given `name` with `params`.

`EventEmitter.prototype**.emitAsync(eventName, params)**`

Emit registered event **asynchronously** with a given `name` with `params`.


`EventEmitter.prototype**.registerEvent(eventName)**`

Register event with given name.


`EventEmitter.prototype**.registerEvents([ eventNames ])**`

Register events with given names.


`EventEmitter**.mult([ names ])**`

Create multiple EventEmitters with given array of names.

## Notes
