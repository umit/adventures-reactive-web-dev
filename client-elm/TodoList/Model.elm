module TodoList.Model (Model, Tasks, initialModel) where

import Common.Model exposing (Todo)
import Effects exposing (Never)
import Task exposing (Task)


type alias Model =
  { todos : List Todo
  , message : String
  }


type alias Tasks =
  { loadTodos : Task Never Model
  , deleteTodo : Int -> Task Never Model
  }


initialModel : Model
initialModel =
  { todos = []
  , message = "Initializing..."
  }

