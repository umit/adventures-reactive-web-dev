module TodoForm.Feature
  ( todoFormFeature
  ) where

import Library.Feature exposing (Feature, createFeature)

import TodoForm.Update exposing (actions, initialModel, update)
import TodoForm.View exposing (view)


todoFormFeature : Feature
todoFormFeature =
  createFeature
  { actions = actions
  , initialModel = initialModel
  , update = update
  , view = view
  }
