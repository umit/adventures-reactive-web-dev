module TodoList.Model (Model, Todo, Tasks) where

import Effects exposing (Never)
import Task exposing (Task)


type alias Todo =
  { id : Int
  , priority : Int
  , description : String
  }


type alias Model =
  { todos : List Todo
  , message : String
  }


type alias Tasks =
  { loadTodos : Task Never Model
  , deleteTodo : Int -> Task Never Model
  }
