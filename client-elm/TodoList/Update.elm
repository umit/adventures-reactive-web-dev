module TodoList.Update (initialModel, update) where

import Effects exposing (Effects, Never)
import Task exposing (Task)
import TodoList.Action exposing (Action(NoOp, LoadList, ShowList, DeleteTodo))
import TodoList.Model exposing (Model, Tasks)


initialModel : ( Model, Effects Action )
initialModel =
  ( { todos = []
    , message = "Initializing..."
    }
  , Effects.none
  )


update : Tasks -> Action -> Model -> ( Model, Effects Action )
update tasks action model =
  case action of
    NoOp ->
      ( model, Effects.none )

    LoadList ->
      ( { todos = []
        , message = "Loading, please wait..."
        }
      , Effects.task (tasks.loadTodos |> Task.map ShowList)
      )

    ShowList list ->
      ( list, Effects.none )

    DeleteTodo todoId ->
      ( { todos = []
        , message = "Deleting, please wait..."
        }
      , Effects.task (tasks.deleteTodo todoId |> Task.map ShowList)
      )
