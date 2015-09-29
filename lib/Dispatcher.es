"use strict";

/**
 * @typedef {Function} Constructor
 */

import CallbackSet from './CallbackSet';

/**
 * @type {Dispatcher}
 */
export default class Dispatcher
{

    /**
     * @constructor
     */
    constructor() {

        /**
         * @type {WeakMap}
         * @private
         */
        this._map = new WeakMap();
    }

    /**
     * @desc Determine if a given event has listeners.
     * @param {Constructor} eventConstructor - Event object constructor
     * @returns {boolean}
     */
    hasListeners(eventConstructor) {

        return this._map.has(eventConstructor);
    }

    /**
     * @desc Register an event listener with the dispatcher.
     * @param {Constructor} eventConstructor - Event object constructor
     * @param {Function|Function[]} callbacks - Callback or list of callbacks
     * @returns {Dispatcher}
     */
    listen(eventConstructor, callbacks) {

        if( !(eventConstructor instanceof Function) )
            throw new TypeError( `${typeof eventConstructor} is not a Constructor` );

        /** @type {CallbackSet} */
        let listeners =
            this._map.get(eventConstructor) || new CallbackSet;

        if(Array.isArray(callbacks) && callbacks.length)
            callbacks.forEach(callback => listeners.add(callback));

        else
            listeners.add(callbacks);

        this._map.set(eventConstructor, listeners);

        return this;
    }

    /**
     * @desc Fire an event and call the listeners.
     * @param {Object} eventObject - Instance of Event registered
     * @param {Constructor} eventObject.constructor - Event object constructor
     * @returns {Dispatcher}
     */
    fire(eventObject) {

        /** @type {CallbackSet} */
        let listeners = this._map.get(eventObject.constructor);

        if(listeners instanceof Set)
            listeners.forEach(callback => {

                if(callback instanceof Function)
                    callback(eventObject);

            });

        return this;
    }
};
