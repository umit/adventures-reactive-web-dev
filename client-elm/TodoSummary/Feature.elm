module TodoSummary.Feature (createTodoSummaryFeature) where

import Effects exposing (Effects)
import StartApp exposing (App, start)
import TodoSummary.Action exposing (Action)
import TodoSummary.Model exposing (Model)
import TodoSummary.Update exposing (update)
import TodoSummary.View exposing (view)


type alias Config =
  { inputs : List (Signal Action)
  }


createTodoSummaryFeature : Config -> App Model
createTodoSummaryFeature config =
  start
    { init = ( { todos = [], lastSaved = Nothing }, Effects.none )
    , update = update
    , view = view
    , inputs = config.inputs
    }

