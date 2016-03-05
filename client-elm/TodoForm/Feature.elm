module TodoForm.Feature
  ( todoFormFeature
  ) where

import Library.Feature exposing (Feature, createFeature)

import TodoForm.Action exposing (Action)
import TodoForm.Service exposing (saveTodo)
import TodoForm.Update exposing (actions, initialModel, update)
import TodoForm.View exposing (view)


todoFormFeature : Signal Action -> Feature
todoFormFeature externalSignal =
  createFeature
  { signal = Signal.merge externalSignal actions.signal
  , address = actions.address
  , initialModel = initialModel
  , update = update { saveTodo = saveTodo }
  , view = view
  }
