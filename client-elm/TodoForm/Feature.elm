module TodoForm.Feature
  ( todoFormFeature
  ) where

import Library.Feature exposing (Feature, createFeature)

import TodoForm.Action exposing (Action)
import TodoForm.Service exposing (saveTodo)
import TodoForm.Update exposing (actions, initialModel, update)
import TodoForm.View exposing (view)


todoFormFeature : Feature Action
todoFormFeature =
  createFeature
  { actions = actions
  , initialModel = initialModel
  , update = update
  , view = view
  }
