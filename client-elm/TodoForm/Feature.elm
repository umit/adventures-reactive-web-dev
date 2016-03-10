module TodoForm.Feature (createTodoFormFeature) where

import StartApp exposing (App, start)
import TodoForm.Action exposing (Action)
import TodoForm.Model
import TodoForm.Service exposing (saveTodo)
import TodoForm.Update exposing (initialModel, update)
import TodoForm.View exposing (view)
import TodoList.Model exposing (Model)


type alias Config =
  { inputs : List (Signal.Signal Action)
  , context :
      { updateListAddress : Signal.Address Model
      }
  }


createTodoFormFeature : Config -> App TodoForm.Model.Model
createTodoFormFeature config =
  start
    { init = initialModel
    , update =
        update
          { saveTodo = saveTodo
          , output = Signal.send config.context.updateListAddress
          }
    , view = view
    , inputs = config.inputs
    }
