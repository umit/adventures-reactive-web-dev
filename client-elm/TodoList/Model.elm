module TodoList.Model (Model, initialModel) where

import Common.Model exposing (Todo)


type alias Model =
  { todos : List Todo
  , message : String
  }


initialModel : Model
initialModel =
  { todos = []
  , message = "Initializing..."
  }

