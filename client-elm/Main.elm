module Main where

import Effects exposing (Never)
import Html exposing (Html, div)
import Http
import Task exposing (Task)

import TodoList.Feature exposing (model, taskRunner, todoListFeature)
import TodoForm.Feature exposing (todoFormFeature)


mainView : Html -> Html -> Html
mainView todoListView todoFormView =
  div []
  [ todoFormView
  , todoListView
  ]


main : Signal Html
main =
  Signal.map2 mainView todoListFeature todoFormFeature


port portTaskRunner : Signal (Task Never ())
port portTaskRunner =
  taskRunner
