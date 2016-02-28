module Main where

import Effects exposing (Never)
import Html exposing (Html, div)
import Http
import Task exposing (Task, succeed)

import TodoForm.Action exposing (Action(Edit))
import TodoForm.Feature exposing (todoFormFeature)
import TodoList.Action exposing (Action(EditTodo))
import TodoList.Feature exposing (todoListFeature)


mainView : Html -> Html -> Html
mainView todoListView todoFormView =
  div []
  [ todoFormView
  , todoListView
  ]


editTodo : Signal.Address TodoForm.Action.Action
  -> TodoList.Action.Action
  -> (Task x ())

editTodo formAddress listAction =
  case listAction of
    EditTodo todo ->
      Signal.send formAddress (Edit todo)

    _ ->
      succeed ()

main : Signal Html
main =
  Signal.map2 mainView todoListFeature.viewSignal todoFormFeature.viewSignal


port portTaskRunner : Signal (Task Never ())
port portTaskRunner =
  Signal.mergeMany
  [ todoListFeature.taskRunner
  , todoFormFeature.taskRunner
  ]


port portEditTodo : Signal (Task x ())
port portEditTodo =
  Signal.map (editTodo todoFormFeature.actions.address) todoListFeature.actions.signal
