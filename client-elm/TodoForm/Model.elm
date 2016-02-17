module TodoForm.Model
  ( Model
  , initialModel
  ) where

import TodoList.Model exposing (Todo)


type alias Model = { todo: Todo, validationErrors: List String }

initialModel : Model
initialModel =
  { todo={id=0, priority=0, description=""}, validationErrors=[] }
