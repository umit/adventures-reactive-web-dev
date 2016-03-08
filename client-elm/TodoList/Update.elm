module TodoList.Update (initialModel, update) where

import Effects exposing (Never)
import Task exposing (Task)
import Library.IO exposing (MbTask)
import TodoList.Action exposing (Action(NoOp, LoadList, ShowList, DeleteTodo))
import TodoList.Model exposing (Model, Tasks)


initialModel : ( Model, MbTask Action )
initialModel =
  ( { todos = []
    , message = "Initializing..."
    }
  , Nothing
  )


update : Tasks -> Action -> Model -> ( Model, MbTask Action )
update tasks action model =
  case action of
    NoOp ->
      ( model, Nothing )

    LoadList ->
      ( { todos = []
        , message = "Loading, please wait..."
        }
      , Just (tasks.loadTodos |> Task.map ShowList)
      )

    ShowList list ->
      ( list, Nothing )

    DeleteTodo todoId ->
      ( { todos = []
        , message = "Deleting, please wait..."
        }
      , Just (tasks.deleteTodo todoId |> Task.map ShowList)
      )
