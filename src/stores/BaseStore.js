
 /**
  * @providesModule BaseStore
  */

import Dispatcher from 'Dispatcher';

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
   remove(key) {
     return this.storage.delete(key);
   }


   /**
    * abstract method
    * it must override in subclass
    */
   getDispatchRegister() {
     throw new Error('abstract method invoke! you should override getDispatchRegister in your own store');
   }
 }
