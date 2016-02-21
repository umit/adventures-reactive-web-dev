module TodoList.Update
  ( actions
  , initialModel
  , update
  ) where

import Library.IO exposing (MbTask)
import TodoList.Model exposing (Model)
import TodoList.Action exposing (Action(LoadList, ShowList))
import TodoList.Service exposing (loadTodosAction)


initialModel : (Model, MbTask Action)
initialModel =
  ({todos=[], message="Initializing..."}, Nothing)


actions : Signal.Mailbox Action
actions =
  Signal.mailbox (ShowList {message="WE NEVER SEE THIS", todos=[]})


update : Action -> Model -> (Model, MbTask Action)
update action model =
  case action of
    LoadList ->
      ({todos=[], message="Loading, please wait..."}, Just loadTodosAction)

    ShowList list ->
      (list, Nothing)

    _ ->
      (model, Nothing)
