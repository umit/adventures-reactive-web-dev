module TodoForm.Model
  ( Model
  ) where

import TodoList.Model exposing (Todo)


type alias Model = { todo: Todo, validationErrors: List String }
