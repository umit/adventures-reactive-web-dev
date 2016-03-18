module TodoMinMax.Update (update) where

import Effects exposing (Effects)
import TodoMinMax.Action exposing (Action(Update))
import TodoMinMax.Model exposing (Model)


update : Action -> Model -> ( Model, Effects Action )
update action model =
  case action of
    Update todos ->
      ( { model | todos = todos }, Effects.none )

