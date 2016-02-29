module TodoList.Feature
  ( todoListFeature
  ) where

import Library.Feature exposing (Feature, createFeature)

import TodoList.Action exposing (Action)
import TodoList.Service exposing (loadTodos, deleteTodo)
import TodoList.Update exposing (actions, initialModel, update)
import TodoList.View exposing (view)


todoListFeature : Feature Action
todoListFeature =
  createFeature
  { actions = actions
  , initialModel = initialModel
  , update = update {loadTodos = loadTodos, deleteTodo = deleteTodo}
  , view = view
  }
