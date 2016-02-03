module TodoList.Model
  ( Model
  , Todo
  , initialModel
  ) where


type alias Todo = { id: Int, priority: Int, description: String }
type alias Model = List Todo

initialModel : List Todo
initialModel =
  []
