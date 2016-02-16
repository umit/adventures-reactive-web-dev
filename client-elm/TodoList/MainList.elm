module TodoList.MainList (
  model,
  mainList,
  runLoadTodosTask
  ) where

import Html exposing (Html)
import Http
import Task exposing (Task)

import TodoList.View exposing (view)
import TodoList.Model exposing (Model, initialModel)
import TodoList.Update exposing (actions, runLoadTodos, update)


model : Signal Model
model =
  Signal.foldp update initialModel actions.signal


mainList : Signal Html
mainList =
  Signal.map (view actions.address) model


runLoadTodosTask : Signal (Task Http.Error ())
runLoadTodosTask =
  Signal.map runLoadTodos actions.signal

