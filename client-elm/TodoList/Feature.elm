module TodoList.Feature
  ( --taskRunner
  {-,-} todoListFeature
  ) where

import Effects exposing (Never)
import Html exposing (Html)
import Http
import Maybe exposing (withDefault)
import Task exposing (Task, andThen)

import Library.Feature exposing (createFeature)
import Library.IO exposing (MbTask)
import TodoList.Model exposing (Model)
import TodoList.Action exposing (Action)
import TodoList.View exposing (view)
import TodoList.Update exposing (actions, initialModel, update)


todoListFeature : Signal Html
todoListFeature =
  createFeature
  { actions = actions
  , initialModel = initialModel
  , update = update
  , view = view
  }
