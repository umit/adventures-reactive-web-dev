module TodoMain (todoMainFeature) where

import Common.Model exposing (Todo, blankTodo)
import Effects exposing (Never)
import Html exposing (Html, div)
import Task exposing (Task)
import StartApp exposing (App, start)
import TodoList.Action exposing (Action(ShowList, UpdateList))
import TodoList.Feature exposing (TodoListFeature, createTodoListFeature)
import TodoList.Model


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (ShowList TodoList.Model.initialModel)


todoListFeature : TodoListFeature
todoListFeature =
  createTodoListFeature
    { inputs = [ todoListMailbox.signal ]
    , outputs =
        { onEditTodo = []
        , onUpdatedList = []
        }
    }


todoMainView : Html -> Html
todoMainView todoListView =
  div
    []
    [ todoListView
    ]


html : Signal Html
html =
  Signal.map todoMainView todoListFeature.html


tasks : Signal (Task Never ())
tasks =
  Signal.mergeMany
    [ todoListFeature.tasks
    ]


todoMainFeature =
  { html = html
  , tasks = tasks
  }

