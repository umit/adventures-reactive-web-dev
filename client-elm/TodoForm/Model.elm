module TodoForm.Model (Model, Tasks, initialModel) where

import Common.Model exposing (Todo, blankTodo)
import Effects exposing (Never)
import Task exposing (Task)
import TodoList.Model


type alias Model =
  { todo : Todo
  , validationErrors : List String
  }


type alias Tasks =
  { saveTodo : Todo -> Task Never TodoList.Model.Model
  , output : TodoList.Model.Model -> Task Never ()
  }


initialModel : Model
initialModel =
  { todo = blankTodo
  , validationErrors = []
  }

