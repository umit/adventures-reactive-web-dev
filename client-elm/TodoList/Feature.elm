module TodoList.Feature
  ( createTodoListFeature
  ) where

import Library.Feature exposing ( Feature, createFeature )

import TodoList.Action exposing ( Action )
import TodoList.Model exposing ( Todo )
import TodoList.Service exposing ( loadTodos, deleteTodo )
import TodoList.Update exposing ( actions, initialModel, update )
import TodoList.View exposing ( view )


type alias Config =
  { inputs : List ( Signal.Signal Action )
  , outputs :
    { editTodoAddress : Signal.Address Todo 
    }
  }


createTodoListFeature : Config -> Feature
createTodoListFeature config =
  createFeature
  { inputs = config.inputs
  , initialModel = initialModel
  , update =
      update
      { loadTodos = loadTodos
      , deleteTodo = deleteTodo
      }
  , view = view config.outputs.editTodoAddress
  }
