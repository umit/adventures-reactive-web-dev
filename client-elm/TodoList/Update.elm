module TodoList.Update
  ( actions
  , initialModel
  , update
  ) where

import Effects exposing (Never)
import Task exposing (Task)

import Library.IO exposing (MbTask)
import TodoList.Model exposing (Model)
import TodoList.Action exposing (Action(LoadList, ShowList))
import TodoList.Service exposing (loadTodos)


initialModel : (Model, MbTask Action)
initialModel =
  ({todos=[], message="Initializing..."}, Nothing)


actions : Signal.Mailbox Action
actions =
  Signal.mailbox (ShowList {message="WE NEVER SEE THIS", todos=[]})


loadTodosAction : Task Never Action
loadTodosAction =
  loadTodos |> Task.map ShowList


update : Action -> Model -> (Model, MbTask Action)
update action model =
  case action of
    LoadList ->
      ({todos=[], message="Loading, please wait..."}, Just loadTodosAction)

    ShowList list ->
      (list, Nothing)

    _ ->
      (model, Nothing)
