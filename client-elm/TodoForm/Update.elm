module TodoForm.Update (initialModel, update) where

import Effects exposing (Effects, Never)
import Task exposing (Task)
import TodoForm.Action exposing (Action(NoOp, Edit, Cancel, Save, UpdateList))
import TodoForm.Model exposing (Model, Tasks)
import TodoList.Model exposing (Todo)


initialModel : ( Model, Effects Action )
initialModel =
  ( { todo =
        { id = 0
        , priority = 0
        , description = ""
        }
    , validationErrors = []
    }
  , Nothing
  )


update : Tasks -> Action -> Model -> ( Model, Effects Action )
update tasks action model =
  case action of
    NoOp ->
      ( model, Effects.none )

    Edit todo ->
      ( { todo = todo, validationErrors = [] }, Effects.none )

    Cancel ->
      initialModel

    Save todo ->
      ( model, Effects.task (tasks.saveTodo todo |> Task.map UpdateList) )

    UpdateList model ->
      ( fst initialModel, Effects.task (tasks.output model |> Task.map (always Cancel)) )
