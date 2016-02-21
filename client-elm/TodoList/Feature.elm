module TodoList.Feature
  ( todoListFeature
  ) where

import Library.Feature exposing (Feature, createFeature)

import TodoList.Update exposing (actions, initialModel, update)
import TodoList.View exposing (view)


todoListFeature : Feature
todoListFeature =
  createFeature
  { actions = actions
  , initialModel = initialModel
  , update = update
  , view = view
  }
