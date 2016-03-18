module TodoMain (todoMainFeature) where

import Effects exposing (Never)
import Html exposing (Html, div)
import StartApp exposing (App)
import Task exposing (Task)
import TodoManager.Feature exposing (Feature, createTodoManagerFeature)
import TodoMinMax.Action exposing (Action(Update))
import TodoMinMax.Feature exposing (createTodoMinMaxFeature)
import TodoMinMax.Model


todoMinMaxMailbox : Signal.Mailbox TodoMinMax.Action.Action
todoMinMaxMailbox =
  Signal.mailbox (Update [])


todoMinMaxFeature : App TodoMinMax.Model.Model
todoMinMaxFeature =
  createTodoMinMaxFeature { inputs = [ todoMinMaxMailbox.signal ] }


todoManagerFeature : Feature
todoManagerFeature =
  createTodoManagerFeature
    { outputs =
        { onUpdatedList = [ Signal.forwardTo todoMinMaxMailbox.address Update ]
        , onSaveTodo = []
        }
    }


todoMainView : Html -> Html -> Html
todoMainView todoManagerView todoMinMaxView =
  div
    []
    [ todoMinMaxView
    , todoManagerView
    ]


html : Signal Html
html =
  Signal.map2 todoMainView todoManagerFeature.html todoMinMaxFeature.html


tasks : Signal (Task Never ())
tasks =
  todoManagerFeature.tasks


todoMainFeature =
  { html = html
  , tasks = tasks
  }

