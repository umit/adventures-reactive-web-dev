module TodoList.Update
  ( actions
  , initialModel
  , update
  ) where

import Effects exposing (Never)
import Task exposing (Task)

import Library.IO exposing (MbTask)

import TodoList.Action exposing (Action(NoOp, LoadList, ShowList))
import TodoList.Model exposing (Model)
import TodoList.Service exposing (loadTodos)


initialModel : (Model, MbTask Action)
initialModel =
  ({todos=[], message="Initializing..."}, Nothing)


actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp


loadTodosAction : Task Never Action
loadTodosAction =
  loadTodos |> Task.map ShowList


update : Action -> Model -> (Model, MbTask Action)
update action model =
  case action of
    NoOp ->
      (model, Nothing)

    LoadList ->
      ({todos=[], message="Loading, please wait..."}, Just loadTodosAction)

    ShowList list ->
      (list, Nothing)

    _ ->
      (model, Nothing)
