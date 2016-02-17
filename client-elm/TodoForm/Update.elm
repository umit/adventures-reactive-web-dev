module TodoForm.Update
  ( Action
  , actions
  , update
  ) where

import TodoForm.Model exposing (Model)


type Action =
    NoOp
  | Cancel
  | Save

actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp

update : Action -> Model -> Model
update action model =
  case action of
    NoOp ->
      model

    Cancel ->
      model

    Save ->
      model

