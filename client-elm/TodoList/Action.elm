module TodoList.Action
  ( Action(..)
  ) where

import TodoList.Model exposing (Model)


type Action
  = LoadList
  | ShowList Model

