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


todoFormMailbox : Signal.Mailbox TodoForm.Action.Action
todoFormMailbox =
  Signal.mailbox (Edit blankTodo)


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (ShowList TodoList.Model.initialModel)


makeTodoListFeature : Config -> App TodoList.Model.Model
makeTodoListFeature config =
  createTodoListFeature
    { inputs = [ todoListMailbox.signal ]
    , outputs =
        { onEditTodo = [ Signal.forwardTo todoFormMailbox.address Edit ]
        , onUpdatedList = config.outputs.onUpdatedList
        }
    }


makeTodoFormFeature : Config -> App TodoForm.Model.Model
makeTodoFormFeature config =
  createTodoFormFeature
    { inputs = [ todoFormMailbox.signal ]
    , outputs =
        { onSaveTodo =
            Signal.forwardTo todoListMailbox.address UpdateList :: config.outputs.onSaveTodo
        }
    }


makeHtml : App TodoList.Model.Model -> App TodoForm.Model.Model -> Signal Html
makeHtml todoListFeature todoFormFeature =
  Signal.map2 view todoListFeature.html todoFormFeature.html


makeTasks : App TodoList.Model.Model -> App TodoForm.Model.Model -> Signal (Task Never ())
makeTasks todoListFeature todoFormFeature =
  Signal.mergeMany
    [ todoListFeature.tasks
    , todoFormFeature.tasks
    ]


createTodoManagerFeature : Config -> Feature
createTodoManagerFeature config =
  let
    todoListFeature =
      makeTodoListFeature config

    todoFormFeature =
      makeTodoFormFeature config

    html =
      makeHtml todoListFeature todoFormFeature

    tasks =
      makeTasks todoListFeature todoFormFeature
  in
    { html = html
    , tasks = tasks
    }

