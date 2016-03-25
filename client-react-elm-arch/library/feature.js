/*
Config action model =
  { inputs : List (action$)
  , initialModel : ( model, Maybe ( Task action ) )
  , update : action -> model -> ( model, Maybe ( Task action )
  , view : Address action -> model -> Html
  }

Feature =
  { view$ : Html$
  , taskRunner : (Task Never ())$
  }
*/
import {BehaviorSubject} from "rxjs/subject/BehaviorSubject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/scan";
import Maybe from "data.maybe";
import {always, identity, prop} from "ramda";

const createFeature = config => {
  // action$ : Observable<Maybe Action>
  const action$ = new BehaviorSubject(Maybe.Nothing());

  // maybeAction : Observable<Maybe Action>
  let maybeAction$ = action$.map(identity);

  config.inputs.forEach(input$ => {
    maybeAction$ = maybeAction$.merge(input$.map(Maybe.Just));
  });

  // update : { model : Model, task : Maybe ( Task Action ) } -> Maybe Action ->
  //   { model : Model, task : Maybe ( Task Action ) }
  const update = (modelAndTask, maybeAction) => maybeAction
    .map(action => config.update(action, modelAndTask.model))
    .orElse(always(modelAndTask));

  // modelAndTask$ : Observable<[Model, Maybe (Task Action)]>
  const modelAndTask$ = maybeAction$.scan(update, config.initialModel);

  // model$ : Observable<Model>
  const model$ = modelAndTask$.map(prop("model"));

  // view$ : Observable<Html>
  const view$ = model$.map(config.view(maybeAction$));

  // sendAction : Action -> Task Never ()
  const sendAction = action => new Task((rej, res) => action$.next(Maybe.Just(action)));

  // taskRunner$ : Observable<Task Never ()>
  const task$ = modelAndTask$.map(modelAndTask =>
    modelAndTask.task
      .map(t => t.chain(sendAction))
      .orElse(Task.of(null))
  );

  return {
    view$,
    task$
  };
};

export {createFeature};
