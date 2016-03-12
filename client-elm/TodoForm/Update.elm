module TodoForm.Update (initialModelAndEffects, update) where

import Common.Model exposing (Todo)
import Effects exposing (Effects, Never)
import Task exposing (Task)
import TodoForm.Action exposing (Action(NoOp, Edit, Cancel, Save, UpdateList))
import TodoForm.Model exposing (Model, initialModel)
import TodoList.Model


type alias Tasks =
  { saveTodo : Todo -> Task Never TodoList.Model.Model
  , signalSaveTodo : TodoList.Model.Model -> Effects ()
  }


initialModelAndEffects : ( Model, Effects Action )
initialModelAndEffects =
  ( initialModel
  , Effects.none
  )


update : Tasks -> Action -> Model -> ( Model, Effects Action )
update tasks action model =
  case action of
    NoOp ->
      ( model, Effects.none )

    Edit todo ->
      ( { todo = todo, validationErrors = [] }, Effects.none )

    Cancel ->
      initialModelAndEffects

    Save todo ->
      ( model, Effects.task (tasks.saveTodo todo) |> Effects.map UpdateList )

    UpdateList model ->
      ( initialModel, (tasks.signalSaveTodo model) |> Effects.map (always Cancel) )

