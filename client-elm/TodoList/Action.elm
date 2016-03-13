module TodoList.Action (Action(..)) where

import Common.Model exposing (Todo)
import TodoList.Model exposing (Model)


type Action
  = NoOp
  | LoadList
  | ShowList Model
  | UpdateList (Maybe Todo)
  | EditTodo Todo
  | DeleteTodo Int
  | DeletedTodo (Maybe Int)
