module TodoMain (todoMainFeature) where

import Effects exposing (Never)
import Html exposing (Html, div)
import Task exposing (Task)
import Library.Feature exposing (Feature)
import TodoForm.Action exposing (Action(Edit))
import TodoForm.Feature exposing (createTodoFormFeature)
import TodoForm.Update exposing (initialModel)
import TodoList.Action exposing (Action(ShowList))
import TodoList.Feature exposing (createTodoListFeature)
import TodoList.Update exposing (initialModel)


todoFormMailbox : Signal.Mailbox TodoForm.Action.Action
todoFormMailbox =
  Signal.mailbox (TodoForm.Update.initialModel |> fst |> .todo |> Edit)


todoListMailbox : Signal.Mailbox TodoList.Action.Action
todoListMailbox =
  Signal.mailbox (TodoList.Update.initialModel |> fst |> ShowList)


todoListFeature : Feature
todoListFeature =
  createTodoListFeature
    { inputs = [ todoListMailbox.signal ]
    , outputs =
        { editTodoAddress = Signal.forwardTo todoFormMailbox.address Edit
        }
    }


todoFormFeature : Feature
todoFormFeature =
  createTodoFormFeature
    { inputs = [ todoFormMailbox.signal ]
    , outputs =
        { updateListAddress = Signal.forwardTo todoListMailbox.address ShowList
        }
    }


todoMainView : Html -> Html -> Html
todoMainView todoListView todoFormView =
  div
    []
    [ todoFormView
    , todoListView
    ]


viewSignal : Signal Html
viewSignal =
  Signal.map2 todoMainView todoListFeature.viewSignal todoFormFeature.viewSignal


taskRunner : Signal (Task Never ())
taskRunner =
  Signal.mergeMany
    [ todoListFeature.taskRunner
    , todoFormFeature.taskRunner
    ]


todoMainFeature : Feature
todoMainFeature =
  { viewSignal = viewSignal
  , taskRunner = taskRunner
  }

