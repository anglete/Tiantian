/**
 * @providesModule BaseStore
 */

import Dispatcher from 'Dispatcher';
import {
    AsyncStorage
} from 'react-native';

export default class {
  constructor() {

    // flux event dispatcher
    this.dispatcher = Dispatcher;

    // events
    this.events = new Map();

    // storage
    this.storage = new Map();

    // init dispatch register
    let fn = this.getDispatchRegister();
    if (null == fn) {
      this._dispatchToken = null;
      return;
    }
    if (typeof fn != 'function') {
      console.log(`invalid dispatch callback function in class ${this.name}`);
      return;
    }
    this._dispatchToken = this.dispatcher.register(fn);
  }

  /**
   * addListener
   * @param evnet
   * @param callback
   */
  addListener(event, callback) {
    this.events.set(event, callback);
  }

  /**
   * removeListener
   * @param evnet
   * @param callback
   */
  removeListener(event, callback) {
    this.events.delete(event);
  }

  /**
   * event emitter
   * @param event
   * @param args
   */
  emit(event, ...args) {
    const __event = this.events.get(event);
    if (!__event) {
      console.log(`[warn] event[${event}] not added in store[${this.name}]`);
      return;
    }
    __event.apply(__event, args);
  }

  /**
   * load data from store
   * @param key
   * @returns {V}
   */
  load(key) {
    return this.storage.get(key);
  }

  /**
   * set value to store
   * @param key
   * @param value
   * @returns {Map.<K, V>}
   */
  store(key, value) {
    return this.storage.set(key, value);
  }

  /**
   * remove storage item
   * @param key
   * @returns {boolean}
   */
  delete(key) {
    return this.storage.delete(key);
  }

  /**
   *
   * @param key
   * @param value
   * @returns {*}
   */
  async set(key, value) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    return await AsyncStorage.setItem(key, value);
  }

  /**
   *
   * @param key
   * @returns {*}
   */
  async get(key, defaultValue) {
    let value = await AsyncStorage.getItem(key) || defaultValue;
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        // do nothing, can not parse to json return directly
      }
    }
    return value;
  }

  /**
   *
   * @param key
   * @returns {*}
   */
  async remove(key) {
    return await AsyncStorage.removeItem(key);
  }

  /**
   *
   * @param key
   * @param value
   * @returns {*}
   */
  async merge(key, value) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    return await AsyncStorage.mergeItem(key, value);
  }


  /**
   * abstract method
   * it must override in subclass
   */
  getDispatchRegister() {
    throw new Error('abstract method invoke! you should override getDispatchRegister in your own store');
  }
}
