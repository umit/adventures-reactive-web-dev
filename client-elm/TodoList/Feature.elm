module TodoList.Feature
  ( todoListFeature
  ) where

import Library.Feature exposing ( Feature, createFeature )

import TodoList.Action exposing ( Action )
import TodoList.Model exposing ( Todo )
import TodoList.Service exposing ( loadTodos, deleteTodo )
import TodoList.Update exposing ( actions, initialModel, update )
import TodoList.View exposing ( view )


todoListFeature : Signal.Address Todo -> Feature
todoListFeature editTodoAddress =
  createFeature
  { signal = actions.signal
  , address = actions.address
  , initialModel = initialModel
  , update = update { loadTodos = loadTodos, deleteTodo = deleteTodo }
  , view = view editTodoAddress
  }
