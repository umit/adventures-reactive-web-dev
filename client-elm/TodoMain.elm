module TodoMain (todoMainFeature) where

import Effects exposing (Never)
import Html exposing (Html, div)
import StartApp exposing (App)
import Task exposing (Task)
import TodoManager.Feature exposing (Feature, createTodoManagerFeature)
import TodoSummary.Action exposing (Action(Update, LastSaved))
import TodoSummary.Feature exposing (createTodoSummaryFeature)
import TodoSummary.Model


todoSummaryMailbox : Signal.Mailbox TodoSummary.Action.Action
todoSummaryMailbox =
  Signal.mailbox (Update [])


todoSummaryFeature : App TodoSummary.Model.Model
todoSummaryFeature =
  createTodoSummaryFeature { inputs = [ todoSummaryMailbox.signal ] }


todoManagerFeature : Feature
todoManagerFeature =
  createTodoManagerFeature
    { outputs =
        { onUpdatedList = [ Signal.forwardTo todoSummaryMailbox.address Update ]
        , onSaveTodo = [ Signal.forwardTo todoSummaryMailbox.address LastSaved ]
        }
    }


todoMainView : Html -> Html -> Html
todoMainView todoManagerView todoSummaryView =
  div
    []
    [ todoManagerView
    , todoSummaryView
    ]


html : Signal Html
html =
  Signal.map2 todoMainView todoManagerFeature.html todoSummaryFeature.html


tasks : Signal (Task Never ())
tasks =
  todoManagerFeature.tasks


todoMainFeature =
  { html = html
  , tasks = tasks
  }

