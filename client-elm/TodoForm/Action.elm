module TodoForm.Action
  ( Action(..)
  ) where

import TodoList.Model exposing (Todo)


type Action
  = NoOp
  | Cancel
  | Save Todo
