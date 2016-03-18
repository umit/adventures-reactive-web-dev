module TodoForm.Action (Action(..)) where

import Common.Model exposing (Todo)


type Action
  = NoOp
  | Edit Todo
  | ClearForm
  | Save Todo
  | Saved (Maybe Todo)
