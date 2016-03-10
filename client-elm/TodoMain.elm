module TodoMain (todoMainFeature) where

import Effects exposing (Never)
import Html exposing (Html, div)
import Task exposing (Task)
import StartApp exposing (App, start)
import TodoForm.Action exposing (Action(Edit))
import TodoForm.Feature exposing (createTodoFormFeature)
import TodoForm.Model
import TodoForm.Update exposing (initialModel)
import TodoList.Action exposing (Action(ShowList))
import TodoList.Feature exposing (createTodoListFeature)
import TodoList.Model
import TodoList.Update exposing (initialModel)


todoFormMailbox : Signal.Mailbox TodoForm.Action.Action
todoFormMailbox =
  Signal.mailbox (TodoForm.Update.initialModel |> fst |> .todo |> Edit)


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (TodoList.Update.initialModel |> fst |> ShowList)


todoListFeature : App TodoList.Model.Model
todoListFeature =
  createTodoListFeature
    { inputs = [ todoListMailbox.signal ]
    , context =
        { editTodoAddress = Signal.forwardTo todoFormMailbox.address Edit
        }
    }


todoFormFeature : App TodoForm.Model.Model
todoFormFeature =
  createTodoFormFeature
    { inputs = [ todoFormMailbox.signal ]
    , context =
        { updateListAddress = Signal.forwardTo todoListMailbox.address ShowList
        }
    }


todoMainView : Html -> Html -> Html
todoMainView todoListView todoFormView =
  div
    []
    [ todoFormView
    , todoListView
    ]


html : Signal Html
html =
  Signal.map2 todoMainView todoListFeature.html todoFormFeature.html


tasks : Signal (Task Never ())
tasks =
  Signal.mergeMany
    [ todoListFeature.tasks
    , todoFormFeature.tasks
    ]


todoMainFeature =
  { html = html
  , tasks = tasks
  }

