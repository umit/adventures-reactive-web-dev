module TodoSummary.Feature (createTodoSummaryFeature) where

import Common.Model exposing (Todo)
import Effects exposing (Effects)
import StartApp exposing (App, start)
import TodoSummary.Action exposing (Action)
import TodoSummary.Update exposing (update)
import TodoSummary.View exposing (view)


type alias Config =
  { inputs : List (Signal Action)
  }


createTodoSummaryFeature : Config -> App (List Todo)
createTodoSummaryFeature config =
  start
    { init = ( [], Effects.none )
    , update = update
    , view = view
    , inputs = config.inputs
    }

