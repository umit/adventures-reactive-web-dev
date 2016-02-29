module TodoForm.Action
  ( Action(..)
  ) where

import TodoList.Model exposing (Model, Todo)


type Action
  = NoOp
  | Edit Todo
  | Cancel
  | Save Todo
  | UpdateList Model
