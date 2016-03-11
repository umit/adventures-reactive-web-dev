module TodoList.Feature (createTodoListFeature) where

import Common.Model exposing (Todo)
import StartApp exposing (App, start)
import TodoList.Action exposing (Action)
import TodoList.Model exposing (Model)
import TodoList.Service exposing (loadTodos, deleteTodo)
import TodoList.Update exposing (initialModelAndEffects, update)
import TodoList.View exposing (view)


type alias Config =
  { inputs : List (Signal Action)
  , context :
      { editTodoAddress : Signal.Address Todo
      }
  }


createTodoListFeature : Config -> App Model
createTodoListFeature config =
  start
    { init = initialModelAndEffects
    , update =
        update
          { loadTodos = loadTodos
          , deleteTodo = deleteTodo
          }
    , view = view config.context.editTodoAddress
    , inputs = config.inputs
    }

