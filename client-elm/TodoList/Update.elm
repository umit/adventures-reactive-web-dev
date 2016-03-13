module TodoList.Update (initialModelAndEffects, update) where

import Common.Model exposing (Todo)
import Effects exposing (Effects, Never)
import Task exposing (Task)
import TodoList.Action exposing (Action(NoOp, LoadList, ShowList, UpdateList, EditTodo, DeleteTodo))
import TodoList.Model exposing (Model, initialModel)


type alias Tasks =
  { loadTodos : Task Never Model
  , deleteTodo : Int -> Task Never Model
  , signalEditTodo : Todo -> Effects ()
  }


initialModelAndEffects : ( Model, Effects Action )
initialModelAndEffects =
  ( initialModel, Effects.none )


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

    UpdateList maybeTodo ->
      let
        model =
          case maybeTodo of
            Just todo ->
              { todos = []
              , message = "FIXME: implement update list"
              }

            Nothing ->
              { model | message = "Sorry, an error occurred." }
      in
        ( model, Effects.none )

    EditTodo todo ->
      ( model, tasks.signalEditTodo todo |> Effects.map (always NoOp) )

    DeleteTodo todoId ->
      ( { todos = []
        , message = "Deleting, please wait..."
        }
      , Effects.task (tasks.deleteTodo todoId |> Task.map ShowList)
      )

