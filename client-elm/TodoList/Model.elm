module TodoList.Model
  ( Model
  , Todo
  ) where


type alias Todo = { id: Int, priority: Int, description: String }
type alias Model = { todos: List Todo, message: String }

