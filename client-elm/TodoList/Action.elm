module TodoList.Action (Action(..)) where

import TodoList.Model exposing (Model, Todo)


type Action
  = NoOp
  | LoadList
  | ShowList Model
  | DeleteTodo Int
