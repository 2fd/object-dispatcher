"use strict";

var { expect } = require('chai');
var Dispatcher = require('../lib/Dispatcher');

/** @test {Dispatcher} */
describe('Dispatcher', () => {

    it('is a class', () => {
        expect(Dispatcher).to.be.a('function');
        expect( new Dispatcher ).to.be.instanceof(Dispatcher);
    });

    /** @test {Dispatcher#hasListeners} */
    describe('#hasListeners', () => {

        let dispacher = new Dispatcher,
            event = function(){},
            listener = function(){};

        it('is a method', () =>
            expect(dispacher.hasListeners).to.be.a('function')
        );

        it('determine if a given event has listeners', () => {

            expect(dispacher.hasListeners(event)).to.be.false;

            dispacher.listen(event, listener);
            expect(dispacher.hasListeners(event)).to.be.true;
        });

    });


    /** @test {Dispatcher#listen} */
    describe('#listen', () => {

        let dispacher = new Dispatcher,
            event1 = function(){},
            event2 = function(){},
            listener1 = function(){},
            listener2 = function(){};

        it('is a method', () =>
            expect(dispacher.listen).to.be.a('function')
        );

        it('register an event listener with the dispatcher', () => {

            expect(dispacher.hasListeners(event1)).to.be.false;
            dispacher.listen(event1, listener1);
            expect(dispacher.hasListeners(event1)).to.be.true;

            expect(dispacher.hasListeners(event2)).to.be.false;
            dispacher.listen(event2, [listener1, listener2]);
            expect(dispacher.hasListeners(event2)).to.be.true;
        });

        it('only allows register event constructors', () => {

            expect(function tryRegisterNonConstructorEvent( ){
                dispacher.listen('event_name', listener1);
            }).to.throw(TypeError);

        });

        it('only allows register callbacks', () => {

            expect(function tryRegisterNonFunctionCallback() {
                dispacher.listen(event1, 'not_function');
            }).to.throw(TypeError);

            expect(function tryRegisterEmptyArrayCallback() {
                dispacher.listen(event1, []);
            }).to.throw(TypeError);

            expect(function tryRegisterNonFunctionArrayCallback() {
                dispacher.listen(event1, [ 'not_function' ]);
            }).to.throw(TypeError);

            expect(function tryRegisterArrayCallbackWithANonFunction() {
                dispacher.listen(event1, [ listener1, 'not_function' ]);
            }).to.throw(TypeError);
        });
    });


    /** @test {Dispatcher#fire} */
    describe('#fire', () => {

        let ObjectEvent = function(data){
            this._data = data;
        };

        ObjectEvent.prototype.dataIsNumber = function(){
            return (typeof this._data === 'number');
        };

        ObjectEvent.prototype.dataIsString = function(){
            return (typeof this._data === 'string');
        };

        ObjectEvent.prototype.dataIsObject = function(){
            return (typeof this._data === 'object');
        };

        let dispacher = new Dispatcher,

            listener_run = false,
            listener_number = function(event){
                expect(event.dataIsNumber()).to.be.true;
                expect(event.dataIsString()).to.be.false;
                expect(event.dataIsObject()).to.be.false;

                listener_run = true;
            };

        it('is a method', () =>
            expect(dispacher.listen).to.be.a('function')
        );

        it('fire an event and call the listeners', () => {

            dispacher.listen(ObjectEvent, listener_number);
            dispacher.fire( new ObjectEvent(5) );
            expect(listener_run).to.be.true;
        });


    });

});
