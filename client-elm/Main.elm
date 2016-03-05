module Main where

import Effects exposing ( Never )
import Html exposing ( Html, div )
import Http
import Task exposing ( Task, succeed )

import Library.Feature exposing ( Feature )

import TodoForm.Action exposing ( Action ( Edit, UpdateList ) )
import TodoForm.Feature exposing ( todoFormFeature )
import TodoForm.Update exposing ( initialModel )
import TodoList.Action exposing ( Action ( ShowList ) )
import TodoList.Feature exposing ( todoListFeature )
import TodoList.Model exposing ( Todo )


mainView : Html -> Html -> Html
mainView todoListView todoFormView =
  div [ ]
  [ todoFormView
  , todoListView
  ]


editTodoAction : Signal.Mailbox TodoForm.Action.Action
editTodoAction =
  Signal.mailbox ( initialModel |> fst |> .todo |> Edit )


todoListF : Feature
todoListF =
  todoListFeature ( Signal.forwardTo editTodoAction.address Edit )


todoFormF : Feature
todoFormF =
  todoFormFeature editTodoAction.signal

{--
saveTodo : Signal.Address TodoList.Action.Action
  -> TodoForm.Action.Action
  -> (Task x ())

saveTodo listAddress formAction =
  case formAction of
    UpdateList model ->
      Signal.send listAddress (ShowList model)

    _ ->
      succeed ()
--}


main : Signal Html
main =
  Signal.map2 mainView todoListF.viewSignal todoFormF.viewSignal


port portTaskRunner : Signal (Task Never ())
port portTaskRunner =
  Signal.mergeMany
  [ todoListF.taskRunner
  , todoFormF.taskRunner
  ]

{--
port portSaveTodo : Signal (Task x ())
port portSaveTodo =
  Signal.map (saveTodo todoListF.actions.address) todoFormFeature.actions.signal
--}
