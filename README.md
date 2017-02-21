# EPluginize

## Overall Logic
Multiple plugins are listening to an EventEmitter and register actions for them

### IMPORTANT
When the EventEmitter object emits an event, all of the functions attached to that specific event are called synchronously. Any values returned by the called listeners are ignored and will be discarded.

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
