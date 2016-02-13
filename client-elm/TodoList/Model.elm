module TodoList.Model
  ( Model
  , Todo
  , initialModel
  ) where


type alias Todo = { id: Int, priority: Int, description: String }
type alias Model = { todos: List Todo, message: String }

initialModel : Model
initialModel =
  {todos=[], message=""}
