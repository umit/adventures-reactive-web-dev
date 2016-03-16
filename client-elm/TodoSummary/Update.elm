module TodoSummary.Update (update) where

import Effects exposing (Effects)
import TodoSummary.Action exposing (Action(Update, LastSaved))
import TodoSummary.Model exposing (Model)


update : Action -> Model -> ( Model, Effects Action )
update action model =
  case action of
    Update todos ->
      ( { model | todos = todos }, Effects.none )

    LastSaved maybeTodo ->
      ( { model | lastSaved = maybeTodo }, Effects.none )

