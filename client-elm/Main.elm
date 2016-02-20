module Main where

import Html exposing (Html, div)
import Http
import Task exposing (Task)

import TodoList.Feature exposing (model, todoListFeature)
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


{--
port portRunLoadTodos : Signal (Task Http.Error ())
port portRunLoadTodos =
  runLoadTodosTask
--}

