module Common.Model (Todo, blankTodo) where


type alias Todo =
  { id : Int
  , priority : Int
  , description : String
  }


blankTodo : Todo
blankTodo =
  { id = 0
  , priority = 0
  , description = ""
  }

