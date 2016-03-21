module TodoMain (todoMainFeature) where

import Common.Model exposing (Todo, blankTodo)
import Effects exposing (Never)
import Html exposing (Html, div)
import Task exposing (Task)
import TodoForm.Action exposing (Action(Edit))
import TodoForm.Feature exposing (TodoFormFeature, createTodoFormFeature)
import TodoList.Action exposing (Action(ShowList, UpdateList))
import TodoList.Feature exposing (TodoListFeature, createTodoListFeature)
import TodoList.Model exposing (initialModel)


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (ShowList initialModel)


todoFormMailbox : Signal.Mailbox TodoForm.Action.Action
todoFormMailbox =
  Signal.mailbox (Edit blankTodo)


todoListFeature : TodoListFeature
todoListFeature =
  createTodoListFeature
    { inputs = [ todoListMailbox.signal ]
    , outputs =
        { onEditTodo = [ Signal.forwardTo todoFormMailbox.address Edit ]
        , onUpdatedList = [ ]
        }
    }


todoFormFeature : TodoFormFeature
todoFormFeature =
  createTodoFormFeature
    { inputs = [ todoFormMailbox.signal ]
    , outputs =
        { onSaveTodo =
            [ Signal.forwardTo todoListMailbox.address UpdateList
            ]
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

