module TodoForm.Feature
  ( createTodoFormFeature
  ) where

import Library.Feature exposing ( Feature, createFeature )

import TodoForm.Action exposing ( Action )
import TodoForm.Service exposing ( saveTodo )
import TodoForm.Update exposing ( actions, initialModel, update )
import TodoForm.View exposing ( view )
import TodoList.Model exposing ( Model )


createTodoFormFeature : Signal.Signal Action -> Signal.Address Model -> Feature
createTodoFormFeature inputSignal outputAddress =
  createFeature
  { signal = Signal.merge inputSignal actions.signal
  , address = actions.address
  , initialModel = initialModel
  , update = update { saveTodo = saveTodo }
  , view = view
  }
