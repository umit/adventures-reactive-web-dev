module TodoForm.Update
  ( actions
  , initialModel
  , update
  ) where

import Library.IO exposing (MbTask)

import TodoForm.Action exposing (Action(NoOp, Edit, Cancel, Save))
import TodoForm.Model exposing (Model)


initialModel : (Model, MbTask Action)
initialModel =
  ( { todo =
      { id = 0
      , priority = 0
      , description = ""
      }
    , validationErrors = []
    }
  , Nothing
  )


actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp


update : Action -> Model -> (Model, MbTask Action)
update action model =
  case action of
    NoOp ->
      (model, Nothing)

    Edit todo ->
      ({ todo = todo, validationErrors = [] }, Nothing)

    Cancel ->
      (model, Nothing)

    Save todo ->
      (model, Nothing)
