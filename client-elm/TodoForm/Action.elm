module TodoForm.Action (Action(..)) where

import Common.Model exposing (Todo)


type Action
  = NoOp
  | Edit Todo
  | Cancel
  | Save Todo
  | Saved (Maybe Todo)
