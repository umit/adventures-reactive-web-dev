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
import TodoSummary.Action exposing (Action(Update, LastSaved))
import TodoSummary.Feature exposing (TodoSummaryFeature, createTodoSummaryFeature)


todoFormMailbox : Signal.Mailbox TodoForm.Action.Action
todoFormMailbox =
  Signal.mailbox (Edit blankTodo)


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (ShowList initialModel)


todoSummaryMailbox : Signal.Mailbox TodoSummary.Action.Action
todoSummaryMailbox =
  Signal.mailbox (Update [])


todoListFeature : TodoListFeature
todoListFeature =
  createTodoListFeature
    { inputs = [ todoListMailbox.signal ]
    , outputs =
        { onEditTodo = [ Signal.forwardTo todoFormMailbox.address Edit ]
        , onUpdatedList = [ Signal.forwardTo todoSummaryMailbox.address Update ]
        }
    }


todoFormFeature : TodoFormFeature
todoFormFeature =
  createTodoFormFeature
    { inputs = [ todoFormMailbox.signal ]
    , outputs =
        { onSaveTodo =
            [ Signal.forwardTo todoListMailbox.address UpdateList
            , Signal.forwardTo todoSummaryMailbox.address LastSaved
            ]
        }
    }


todoSummaryFeature : TodoSummaryFeature
todoSummaryFeature =
  createTodoSummaryFeature { inputs = [ todoSummaryMailbox.signal ] }


todoMainView : Html -> Html -> Html -> Html
todoMainView todoListView todoFormView todoSummaryView =
  div
    []
    [ todoFormView
    , todoListView
    , todoSummaryView
    ]


html : Signal Html
html =
  Signal.map3 todoMainView todoListFeature.html todoFormFeature.html todoSummaryFeature.html


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

