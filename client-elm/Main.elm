module Main where

import Html exposing (Html)
import Http
import Task exposing (Task)

import TodoList.MainList exposing (model, mainList, runLoadTodosTask)


main : Signal Html
main =
  mainList


port portRunLoadTodos : Signal (Task Http.Error ())
port portRunLoadTodos =
  runLoadTodosTask

