module TodoMain (todoMainFeature) where

import Common.Model exposing (Todo, blankTodo)
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
import TodoSummary.Action exposing (Action(Update))
import TodoSummary.Feature exposing (createTodoSummaryFeature)


todoFormMailbox : Signal.Mailbox TodoForm.Action.Action
todoFormMailbox =
  Signal.mailbox (Edit blankTodo)


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (ShowList TodoList.Model.initialModel)


todoSummaryMailbox : Signal.Mailbox TodoSummary.Action.Action
todoSummaryMailbox =
  Signal.mailbox (Update [])


todoListFeature : App TodoList.Model.Model
todoListFeature =
  createTodoListFeature
    { inputs = [ todoListMailbox.signal ]
    , outputs =
        { onEditTodo = [ Signal.forwardTo todoFormMailbox.address Edit ]
        , onUpdatedList = [ Signal.forwardTo todoSummaryMailbox.address Update ]
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


todoSummaryFeature : App (List Todo)
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

