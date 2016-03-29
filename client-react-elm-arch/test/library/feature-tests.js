import { expect } from "chai" ;
import { Just, Nothing } from "data.maybe" ;
import Task from "data.task" ;
import { identity, inc, lensProp, merge, over } from "ramda" ;
import { Subject } from "rxjs/Subject" ;
import Type from "union-type" ;

import { createFeature, taskRunner } from "../../library/feature" ;

describe("library/feature", function() {
  const baseConfig =
    { inputs : []
    , initialModel :
      { model : {}
      , task : Nothing()
      }
    , update : action => model =>
      ({ model : model
      , task : Nothing()
      })
    , view : address => model => null
    } ;

  it("creates a feature", function() {
    const feature = createFeature(baseConfig) ;

    expect(feature.view$).to.exist ;
    expect(feature.task$).to.exist ;
  }) ;

  it("calls the view with an address and a model", function(done) {
    const initial = { duck : "quack" } ;

    const feature = createFeature(merge(baseConfig,
      { initialModel :
        { model : initial
        , task : Nothing()
        }
      , view : address => model => {
          expect(address).to.exist ;
          expect(address.next).to.exist ;
          expect(address.next).to.be.a("function") ;

          expect(model).to.equal(initial) ;

          done() ;
        }
      })) ;

    feature.view$.subscribe(identity) ;
  }) ;

  it("calls update with an action and a model", function(done) {
    const initial = { duck : "quack" } ;
    const testAction = "TEST" ;
    let flag = true ;

    const feature = createFeature(merge(baseConfig,
      { initialModel :
        { model : initial
        , task : Nothing()
        }
      , view : address => model => {
          if (flag) {
            flag = false ;
            address.next(testAction) ;
          }
        }
      , update : action => model => {
          expect(action).to.equal(testAction) ;
          expect(model).to.equal(initial) ;
          done() ;
          return { model, task : Nothing() } ;
        }
      })) ;

    feature.view$.subscribe(identity) ;
  }) ;

  it("sends the next action", function(done) {
    const firstAction = "first" ;
    const secondAction = "second" ;
    const task = Task.of(secondAction) ;

    let flag = true ;

    const feature = createFeature(merge(baseConfig,
      { view : address => model => {
          if (flag) {
            flag = false ;
            address.next(firstAction) ;
            return "view 1" ;
          }
          return "view 2" ;
        }
      , update : action => model => {
          if (action === firstAction) {
            return { model, task : Just(task) } ;
          }
          else if (action === secondAction) {
            done() ;
            return { model, task : Nothing() } ;
          }
        }
      })) ;

    feature.view$.subscribe(identity) ;
    feature.task$.subscribe(taskRunner) ;
  }) ;

  it("updates the model", function(done) {
    const INCREMENT = "increment" ;

    let flag = true ;

    const feature = createFeature(merge(baseConfig,
      { initialModel :
        { model : { counter : 1 }
        , task : Nothing()
        }
      , update : action => model => {
          if (action === INCREMENT) {
            return { model : over(lensProp("counter"), inc, model), task : Nothing() } ;
          }
          return { model, task : Nothing() } ;
        }
      , view : address => model => {
          if (flag) {
            flag = false ;
            address.next(INCREMENT) ;
          }
          else {
            expect(model.counter).to.equal(2) ;
            done() ;
          }
        }
      })) ;

    feature.view$.subscribe(identity) ;
  }) ;

  it("merges input signals", function(done) {
    const INCREMENT = "increment" ;

    let flag = true ;

    const input = new Subject() ;

    const feature = createFeature(merge(baseConfig,
      { initialModel :
        { model : { counter : 1 }
        , task : Nothing()
        }
      , update : action => model => {
          if (action === INCREMENT) {
            return { model : over(lensProp("counter"), inc, model), task : Nothing() } ;
          }
          return { model, task : Nothing() } ;
        }
      , view : address => model => {
          if (model.counter === 2) {
            done() ;
          }
        }
      , inputs : [ input ]
      })) ;

    feature.view$.subscribe(identity) ;

    input.next(INCREMENT) ;
  }) ;

  it("executes tasks", function(done) {
    const INCREMENT = "increment" ;
    const NO_OP = "noOp" ;

    let flag = true ;

    const input = new Subject() ;

    const task = new Task((rej, res) => {
      flag = false ;
      res(NO_OP) ;
    }) ;

    const feature = createFeature(merge(baseConfig,
      { initialModel :
        { model : { counter : 1 }
        , task : Nothing()
        }
      , update : action => model => {
          if (action === INCREMENT) {
            return { model : over(lensProp("counter"), inc, model), task : Just(task) } ;
          }
          return { model, task : Nothing() } ;
        }
      , view : address => model => {
          if (!flag) {
            done() ;
          }
        }
      , inputs : [ input ]
      })) ;

    feature.view$.subscribe(identity) ;
    feature.task$.subscribe(taskRunner) ;

    input.next(INCREMENT) ;
  }) ;

  it("dispatches the next action", function(done) {
    const input = new Subject() ;
    const output = new Subject() ;

    const todos =
    [ { id : 1
      , description : "test 1"
      }
    , { id : 2
      , description : "test 2"
      }
    ] ;

    const Action = Type
    ( { NoOp : []
      , LoadList : []
      , ShowList : [Array]
      }
    ) ;

    const loadListTask = new Task((rej, res) => res(Action.ShowList(todos))) ;

    const showListTask = new Task((rej, res) => {
      output.next(todos);
      res(Action.NoOp());
    }) ;

    const handler = model =>
    ( { NoOp : () => {
          expect(model).to.deep.equal(todos) ;
          done() ;
          return { model, task : Nothing() } ;
        }
      , LoadList : () => ({ model : [], task : Just(loadListTask)})
      , ShowList : todos => ({ model : todos, task : Just(showListTask) })
      }
    ) ;

    const feature = createFeature(merge(baseConfig,
      { update : action => model => Action.case(handler(model), action)
      , inputs : [ input ]
      })) ;

    feature.task$.subscribe(taskRunner) ;

    input.next(Action.LoadList()) ;
  }) ;
}) ;
