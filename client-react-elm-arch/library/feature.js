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
import Maybe from "data.maybe";
import {always} from "ramda";

const createFeature = config => {
  // actions$ : Maybe Action
  const actions$ = new BehaviorSubject(Maybe.Nothing());

  // update : Maybe Action -> ( Model, Maybe ( Task Action ) ) -> ( Model, Maybe ( Task Action ) )
  const update = (maybeAction, pair) => maybeAction.map(
      action => config.update(action, pair[0])
    ).orElse(always(pair));

};
