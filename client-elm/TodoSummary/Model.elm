module TodoSummary.Model (Model) where

import Common.Model exposing (Todo)


type alias Model =
  { todos : List Todo
  , lastSaved : (Maybe Todo)
  }

