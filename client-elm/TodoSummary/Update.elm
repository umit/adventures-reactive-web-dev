module TodoSummary.Update (update) where

import Common.Model exposing (Todo)
import Effects exposing (Effects)
import TodoSummary.Action exposing (Action(Update))


update : Action -> List Todo -> ( List Todo, Effects Action )
update action model =
  case action of
    Update todos ->
      ( todos, Effects.none )

