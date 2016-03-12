module TodoList.Feature (createTodoListFeature) where

import Common.Model exposing (Todo)
import Effects
import StartApp exposing (App, start)
import TodoList.Action exposing (Action)
import TodoList.Model exposing (Model)
import TodoList.Service exposing (loadTodos, deleteTodo)
import TodoList.Update exposing (initialModelAndEffects, update)
import TodoList.View exposing (view)


type alias Config =
  { inputs : List (Signal Action)
  , outputs :
      { onEditTodo : List (Signal.Address Todo)
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
          , signalEditTodo =
              \data ->
                (List.map ((flip Signal.send) data) config.outputs.onEditTodo)
                  |> (List.map Effects.task)
                  |> Effects.batch
          }
    , view = view
    , inputs = config.inputs
    }

