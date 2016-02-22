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


initialModel : (Model, MbTask Action)
initialModel =
  ({todos=[], message="Initializing..."}, Nothing)


actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp


update : Task Never Model -> Action -> Model -> (Model, MbTask Action)
update loadTodos action model =
  case action of
    NoOp ->
      (model, Nothing)

    LoadList ->
      ( { todos=[]
        , message="Loading, please wait..."
        }
      , Just (loadTodos |> Task.map ShowList)
      )

    ShowList list ->
      (list, Nothing)

    _ ->
      (model, Nothing)
