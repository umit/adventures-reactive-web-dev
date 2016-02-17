module TodoForm.Feature
  where

import Html exposing (Html)

import TodoForm.View exposing (view)
import TodoForm.Model exposing (Model, initialModel)
import TodoForm.Update exposing (actions, update)


model : Signal Model
model =
  Signal.foldp update initialModel actions.signal


todoFormFeature : Signal Html
todoFormFeature =
  Signal.map (view actions.address) model


