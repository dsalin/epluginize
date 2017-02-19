/**
* EPluginize package.
* 
* @package
*/

import EventEmitter from './lib/EventEmitter.class'
import EventsManager from './lib/EventsManager.single'
import Plugin from './lib/Plugin.class'
import PluginAction from './lib/PluginAction.class'
import PluginManager from './lib/PluginManager.class'
import utils from './lib/utils'

export default {
  EventEmitter,
  EventsManager,
  Plugin,
  PluginAction,
  PluginManager,
  utils
}
