module TodoForm.Action
  ( Action(..)
  ) where

import TodoList.Model exposing (Todo)


type Action
  = NoOp
  | Edit Todo
  | Cancel
  | Save Todo
