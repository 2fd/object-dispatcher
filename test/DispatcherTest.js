"use strict";

var expect = require('chai').expect;
var Dispatcher = require('../lib/Dispatcher');

/** @test {Dispatcher} */
describe('Dispatcher', () => {

    it('is a class', () => {
        expect(Dispatcher).to.be.a('function');
        expect( new Dispatcher ).to.be.instanceof(Dispatcher);
    });

    /** @test {Dispatcher#hasListeners} */
    describe('#hasListeners', () => {

        let dispatcher = new Dispatcher,
            event = function(){},
            listener = function(){};

        it('is a method', () =>
            expect(dispatcher.hasListeners).to.be.a('function')
        );

        it('determine if a given event has listeners', () => {

            expect(dispatcher.hasListeners(event)).to.be.false;

            dispatcher.listen(event, listener);
            expect(dispatcher.hasListeners(event)).to.be.true;
        });

    });


    /** @test {Dispatcher#listen} */
    describe('#listen', () => {

        let dispatcher = new Dispatcher,
            event1 = function(){},
            event2 = function(){},
            listener1 = function(){},
            listener2 = function(){};

        it('is a method', () =>
            expect(dispatcher.listen).to.be.a('function')
        );

        it('register an event listener with the dispatcher', () => {

            expect(dispatcher.hasListeners(event1)).to.be.false;
            dispatcher.listen(event1, listener1);
            expect(dispatcher.hasListeners(event1)).to.be.true;

            expect(dispatcher.hasListeners(event2)).to.be.false;
            dispatcher.listen(event2, [listener1, listener2]);
            expect(dispatcher.hasListeners(event2)).to.be.true;
        });

        it('only allows register event constructors', () => {

            expect(function tryRegisterNonConstructorEvent( ){
                dispatcher.listen('event_name', listener1);
            }).to.throw(TypeError);

        });

        it('only allows register callbacks', () => {

            expect(function tryRegisterNonFunctionCallback() {
                dispatcher.listen(event1, 'not_function');
            }).to.throw(TypeError);

            expect(function tryRegisterEmptyArrayCallback() {
                dispatcher.listen(event1, []);
            }).to.throw(TypeError);

            expect(function tryRegisterNonFunctionArrayCallback() {
                dispatcher.listen(event1, [ 'not_function' ]);
            }).to.throw(TypeError);

            expect(function tryRegisterArrayCallbackWithANonFunction() {
                dispatcher.listen(event1, [ listener1, 'not_function' ]);
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

        let dispatcher = new Dispatcher,

            listener_run = false,
            listener_number = function(event){
                expect(event.dataIsNumber()).to.be.true;
                expect(event.dataIsString()).to.be.false;
                expect(event.dataIsObject()).to.be.false;

                listener_run = true;
            };

        it('is a method', () =>
            expect(dispatcher.listen).to.be.a('function')
        );

        it('fire an event and call the listeners', () => {

            dispatcher.listen(ObjectEvent, listener_number);
            dispatcher.fire( new ObjectEvent(5) );
            expect(listener_run).to.be.true;
        });


    });

});
