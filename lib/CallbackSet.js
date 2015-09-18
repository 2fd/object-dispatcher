"use strict";

/**
 * @type {CallbackSet}
 */
export class CallbackSet extends Set {

    /**
     * @override
     * @param {Function} callback
     * @returns {CallbackSet}
     * @throws TypeError - throw error if callback is not a function
     */
    add(callback){

        if( !(callback instanceof Function) )
            throw new TypeError( `${typeof callback} is not a function` );

        super.add(callback);

        return this;
    }
};