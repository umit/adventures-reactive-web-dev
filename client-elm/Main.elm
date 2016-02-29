module Main where

import Effects exposing (Never)
import Html exposing (Html, div)
import Http
import Task exposing (Task, succeed)

import TodoForm.Action exposing (Action(Edit, UpdateList))
import TodoForm.Feature exposing (todoFormFeature)
import TodoList.Action exposing (Action(EditTodo, ShowList))
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


saveTodo : Signal.Address TodoList.Action.Action
  -> TodoForm.Action.Action
  -> (Task x ())

saveTodo listAddress formAction =
  case formAction of
    UpdateList model ->
      Signal.send listAddress (ShowList model)

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


port portSaveTodo : Signal (Task x ())
port portSaveTodo =
  Signal.map (saveTodo todoListFeature.actions.address) todoFormFeature.actions.signal
