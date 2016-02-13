module TodoList.Model
  ( Model
  , Todo
  , initialModel
  ) where


type alias Todo = { id: Int, priority: Int, description: String }
type alias Model = { todos: List Todo, error: String }

initialModel : Model
initialModel =
  {todos=[], error=""}
