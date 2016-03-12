module TodoForm.Model (Model, initialModel) where

import Common.Model exposing (Todo, blankTodo)


type alias Model =
  { todo : Todo
  , validationErrors : List String
  }


initialModel : Model
initialModel =
  { todo = blankTodo
  , validationErrors = []
  }

