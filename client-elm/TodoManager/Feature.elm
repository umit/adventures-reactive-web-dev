module TodoManager.Feature (Feature, createTodoManagerFeature) where

import Common.Model exposing (Todo, blankTodo)
import Effects exposing (Never)
import Html exposing (Html)
import Task exposing (Task)
import StartApp exposing (App)
import TodoForm.Action exposing (Action(Edit))
import TodoForm.Feature exposing (createTodoFormFeature)
import TodoForm.Model
import TodoList.Action exposing (Action(ShowList, UpdateList))
import TodoList.Feature exposing (createTodoListFeature)
import TodoList.Model
import TodoManager.View exposing (view)
import TodoSummary.Action exposing (Action(Update, LastSaved))
import TodoSummary.Feature exposing (createTodoSummaryFeature)
import TodoSummary.Model


type alias Config =
  { outputs :
      { onUpdatedList : List (Signal.Address (List Todo))
      , onSaveTodo : List (Signal.Address (Maybe Todo))
      }
  }


type alias Feature =
  { html : Signal Html
  , tasks : Signal (Task Never ())
  }


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (ShowList TodoList.Model.initialModel)


todoFormMailbox : Signal.Mailbox TodoForm.Action.Action
todoFormMailbox =
  Signal.mailbox (Edit blankTodo)


todoSummaryMailbox : Signal.Mailbox TodoSummary.Action.Action
todoSummaryMailbox =
  Signal.mailbox (Update [])


makeTodoListFeature : Config -> App TodoList.Model.Model
makeTodoListFeature config =
  createTodoListFeature
    { inputs = [ todoListMailbox.signal ]
    , outputs =
        { onEditTodo = [ Signal.forwardTo todoFormMailbox.address Edit ]
        , onUpdatedList = Signal.forwardTo todoSummaryMailbox.address Update :: config.outputs.onUpdatedList
        }
    }


makeTodoFormFeature : Config -> App TodoForm.Model.Model
makeTodoFormFeature config =
  createTodoFormFeature
    { inputs = [ todoFormMailbox.signal ]
    , outputs =
        { onSaveTodo =
            List.append
              [ Signal.forwardTo todoListMailbox.address UpdateList
              , Signal.forwardTo todoSummaryMailbox.address LastSaved
              ]
              config.outputs.onSaveTodo
        }
    }


makeTodoSummaryFeature : Config -> App TodoSummary.Model.Model
makeTodoSummaryFeature config =
  createTodoSummaryFeature { inputs = [ todoSummaryMailbox.signal ] }


makeHtml : App TodoList.Model.Model -> App TodoForm.Model.Model -> App TodoSummary.Model.Model -> Signal Html
makeHtml todoListFeature todoFormFeature todoSummaryFeature =
  Signal.map3 view todoListFeature.html todoFormFeature.html todoSummaryFeature.html


makeTasks : App TodoList.Model.Model -> App TodoForm.Model.Model -> App TodoSummary.Model.Model -> Signal (Task Never ())
makeTasks todoListFeature todoFormFeature todoSummaryFeature =
  Signal.mergeMany
    [ todoListFeature.tasks
    , todoFormFeature.tasks
    , todoSummaryFeature.tasks
    ]


createTodoManagerFeature : Config -> Feature
createTodoManagerFeature config =
  let
    todoListFeature =
      makeTodoListFeature config

    todoFormFeature =
      makeTodoFormFeature config

    todoSummaryFeature =
      makeTodoSummaryFeature config

    html =
      makeHtml todoListFeature todoFormFeature todoSummaryFeature

    tasks =
      makeTasks todoListFeature todoFormFeature todoSummaryFeature
  in
    { html = html
    , tasks = tasks
    }

