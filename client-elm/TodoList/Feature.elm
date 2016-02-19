module TodoList.Feature (
  model,
  todoListFeature
  ) where

import Html exposing (Html)
import Http
import Task exposing (Task)

import TodoList.View exposing (view)
import TodoList.Model exposing (Model, initialModel)
import TodoList.Update exposing (actions, update)


model : Signal Model
model =
  Signal.foldp update initialModel actions.signal


todoListFeature : Signal Html
todoListFeature =
  Signal.map (view actions.address) model
