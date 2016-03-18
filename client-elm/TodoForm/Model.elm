module TodoForm.Model (Model, initialModel) where

import Common.Model exposing (Todo, blankTodo)


type alias Model =
  { todo : Todo
  }


initialModel : Model
initialModel =
  { todo = blankTodo
  }

