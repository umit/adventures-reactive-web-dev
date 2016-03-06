module Main where

import Effects exposing ( Never )
import Html exposing ( Html, div )
import Http
import Task exposing ( Task, succeed )

import Library.Feature exposing ( Feature )

import TodoForm.Action exposing ( Action ( Edit, UpdateList ) )
import TodoForm.Feature exposing ( createTodoFormFeature )
import TodoForm.Update exposing ( initialModel )
import TodoList.Action exposing ( Action ( ShowList ) )
import TodoList.Feature exposing ( createTodoListFeature )
import TodoList.Model exposing ( Todo )
import TodoList.Update exposing ( initialModel )


mainView : Html -> Html -> Html
mainView todoListView todoFormView =
  div [ ]
  [ todoFormView
  , todoListView
  ]


todoFormMailbox : Signal.Mailbox TodoForm.Action.Action
todoFormMailbox =
  Signal.mailbox ( TodoForm.Update.initialModel |> fst |> .todo |> Edit )


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox ( TodoList.Update.initialModel |> fst |> ShowList )


todoListFeature : Feature
todoListFeature =
  createTodoListFeature
    todoListMailbox.signal
    ( Signal.forwardTo todoFormMailbox.address Edit )


todoFormFeature : Feature
todoFormFeature =
  createTodoFormFeature
    todoFormMailbox.signal
    ( Signal.forwardTo todoListMailbox.address ShowList )


main : Signal Html
main =
  Signal.map2 mainView todoListFeature.viewSignal todoFormFeature.viewSignal


port portTaskRunner : Signal (Task Never ())
port portTaskRunner =
  Signal.mergeMany
  [ todoListFeature.taskRunner
  , todoFormFeature.taskRunner
  ]

