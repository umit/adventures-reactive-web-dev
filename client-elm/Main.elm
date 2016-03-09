module Main (..) where

import TodoMain exposing (todoMainFeature)
import Effects exposing (Never)
import Html exposing (Html)
import Task exposing (Task)


main : Signal Html
main =
  todoMainFeature.viewSignal


port portTaskRunner : Signal (Task Never ())
port portTaskRunner =
  todoMainFeature.taskRunner

