module TodoForm.Model
  ( Model
  , Tasks
  ) where

import Effects exposing ( Never )
import Task exposing ( Task )

import TodoList.Model exposing ( Todo )


type alias Model =
  { todo : Todo
  , validationErrors : List String
  }

type alias Tasks =
  { saveTodo : Todo -> Task Never TodoList.Model.Model
  , showList : TodoList.Model.Model -> Task Never ()
  }
