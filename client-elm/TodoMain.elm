module TodoMain (todoMainFeature) where

import Common.Model exposing (Todo, blankTodo)
import Effects exposing (Never)
import Html exposing (Html, div)
import Task exposing (Task)
import TodoList.Action exposing (Action(ShowList))
import TodoList.Feature exposing (TodoListFeature, createTodoListFeature)
import TodoList.Model exposing (initialModel)


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (ShowList initialModel)


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

