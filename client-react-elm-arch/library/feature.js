/*
Config action model =
  { inputs : List (action$)
  , initialModel : [ model, Maybe ( Task action ) ]
  , update : action -> model -> [ model, Maybe ( Task action ) ]
  , view : Address action -> model -> Html
  }

Feature =
  { view$ : Html$
  , taskRunner : (Task Never ())$
  }
*/
import { BehaviorSubject } from "rxjs/subject/BehaviorSubject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/publishReplay";
import "rxjs/add/operator/scan";
import { Just, fromNullable } from "data.maybe";
import Task from "data.task";
import { identity, prop } from "ramda";

const createFeature = config => {
  // action$ : Observable<Action>
  const action$ = new BehaviorSubject(null);

  // maybeAction : Observable<Maybe Action>
  let maybeAction$ = action$.map(fromNullable);

  config.inputs.forEach(input$ => {
    maybeAction$ = maybeAction$.merge(input$.map(Just));
  });

  // update : { model : Model, task : Maybe ( Task Action ) } -> Maybe Action ->
  //   { model : Model, task : Maybe ( Task Action ) }
  const update = (modelAndTask, maybeAction) => maybeAction
    .map(action => config.update(action)(modelAndTask[0]))
    .getOrElse(modelAndTask);

  // modelAndTask$ : Observable<[Model, Maybe (Task Action)]>
  const modelAndTask$ = maybeAction$.scan(update, config.initialModel).publishReplay(1).refCount();

  // model$ : Observable<Model>
  const model$ = modelAndTask$.map(prop(0));

  // view$ : Observable<Html>
  const view$ = model$.map(config.view(action$));

  // sendAction : Action -> Task Never ()
  const sendAction = action => new Task((rej, res) => res(action$.next(action)));

  // taskRunner$ : Observable<Task Never ()>
  const task$ = modelAndTask$.map(modelAndTask =>
    fromNullable(modelAndTask[1])
    .map(t => t.chain(sendAction))
    .getOrElse(Task.of(null))
  );

  const result = {
    view$,
    task$
  };

  return result;
};

const taskRunner = task => task.fork(identity, identity);

export { createFeature, taskRunner };
