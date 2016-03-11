module TodoForm.Action (Action(..)) where

import Common.Model exposing (Todo)
import TodoList.Model exposing (Model)


type Action
  = NoOp
  | Edit Todo
  | Cancel
  | Save Todo
  | UpdateList Model
