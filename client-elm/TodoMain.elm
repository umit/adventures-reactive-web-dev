module TodoMain (todoMainFeature) where

import Common.Model exposing (blankTodo)
import Effects exposing (Never)
import Html exposing (Html, div)
import Task exposing (Task)
import StartApp exposing (App, start)
import TodoForm.Action exposing (Action(Edit))
import TodoForm.Feature exposing (createTodoFormFeature)
import TodoForm.Model
import TodoList.Action exposing (Action(ShowList, UpdateList))
import TodoList.Feature exposing (createTodoListFeature)
import TodoList.Model


todoFormMailbox : Signal.Mailbox TodoForm.Action.Action
todoFormMailbox =
  Signal.mailbox (Edit blankTodo)


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (ShowList TodoList.Model.initialModel)


todoListFeature : App TodoList.Model.Model
todoListFeature =
  createTodoListFeature
    { inputs = [ todoListMailbox.signal ]
    , outputs =
        { onEditTodo = [ Signal.forwardTo todoFormMailbox.address Edit ]
        }
    }


todoFormFeature : App TodoForm.Model.Model
todoFormFeature =
  createTodoFormFeature
    { inputs = [ todoFormMailbox.signal ]
    , outputs =
        { onSaveTodo = [ Signal.forwardTo todoListMailbox.address UpdateList ]
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

