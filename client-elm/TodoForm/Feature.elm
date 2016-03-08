module TodoForm.Feature
  ( createTodoFormFeature
  ) where

import Library.Feature exposing ( Feature , createFeature )

import TodoForm.Action exposing ( Action )
import TodoForm.Service exposing ( saveTodo )
import TodoForm.Update exposing ( initialModel , update )
import TodoForm.View exposing ( view )
import TodoList.Model exposing ( Model )


type alias Config =
  { inputs : List ( Signal.Signal Action )
  , outputs :
    { updateListAddress : Signal.Address Model
    }
  }


createTodoFormFeature : Config -> Feature
createTodoFormFeature config =
  createFeature
  { inputs = config.inputs
  , initialModel = initialModel
  , update =
      update
      { saveTodo = saveTodo
      , output = Signal.send config.outputs.updateListAddress
      }
  , view = view
  }
