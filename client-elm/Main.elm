module Main where

import Html exposing (Html)
import Http
import Task exposing (Task)

import TodoList.View exposing (view)
import TodoList.Model exposing (Model, initialModel)
import TodoList.Update exposing (onAction, onLoadTodos, runLoadTodos, update)


model : Signal Model
model =
  Signal.foldp update initialModel onAction.signal


main : Signal Html
main =
  Signal.map (view onLoadTodos.address) model


port portRunLoadTodos : Signal (Task Http.Error ())
port portRunLoadTodos =
  Signal.map runLoadTodos onLoadTodos.signal

