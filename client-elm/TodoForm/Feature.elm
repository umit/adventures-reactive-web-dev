module TodoForm.Feature (createTodoFormFeature) where

import Effects
import StartApp exposing (App, start)
import TodoForm.Action exposing (Action)
import TodoForm.Model
import TodoForm.Service exposing (saveTodo)
import TodoForm.Update exposing (initialModelAndEffects, update)
import TodoForm.View exposing (view)
import TodoList.Model exposing (Model)


type alias Config =
  { inputs : List (Signal.Signal Action)
  , outputs :
      { onSaveTodo : List (Signal.Address Model)
      }
  }


createTodoFormFeature : Config -> App TodoForm.Model.Model
createTodoFormFeature config =
  start
    { init = initialModelAndEffects
    , update =
        update
          { saveTodo = saveTodo
          , signalSaveTodo =
              \data ->
                (List.map ((flip Signal.send) data) config.outputs.onSaveTodo)
                  |> (List.map Effects.task)
                  |> Effects.batch
          }
    , view = view
    , inputs = config.inputs
    }

