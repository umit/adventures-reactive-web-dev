module TodoList.Feature (
  model,
  todoListFeature
  ) where

import Html exposing (Html)
import Http
import Task exposing (Task)

import TodoList.View exposing (view)
import TodoList.Model exposing (Model)
import TodoList.Update exposing (Action, MbTask, actions, initialModel, update)


update' : Action -> (Model, MbTask) -> (Model, MbTask)
update' action pair =
  update action (fst pair)


model' : Signal (Model, MbTask)
model' =
  Signal.foldp update' initialModel actions.signal


model : Signal Model
model =
  Signal.map fst model'


todoListFeature : Signal Html
todoListFeature =
  Signal.map (view actions.address) model
