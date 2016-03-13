module TodoForm.Update (initialModelAndEffects, update) where

import Common.Model exposing (Todo)
import Effects exposing (Effects, Never)
import Task exposing (Task, andThen)
import TodoForm.Action exposing (Action(NoOp, Edit, Cancel, Save))
import TodoForm.Model exposing (Model, initialModel)


type alias Tasks =
  { saveTodo : Todo -> Task Never (Maybe Todo)
  , signalSaveTodo : Maybe Todo -> Task Never ()
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
      ( model
      , Effects.task (tasks.saveTodo todo `andThen` tasks.signalSaveTodo)
          |> Effects.map (always Cancel)
      )

