module TodoForm.Update
  ( actions
  , initialModel
  , update
  ) where

import Effects exposing ( Never )
import Task exposing ( Task )

import Library.IO exposing ( MbTask )

import TodoForm.Action exposing ( Action( NoOp, Edit, Cancel, Save, UpdateList ) )
import TodoForm.Model exposing ( Model, Tasks )
import TodoList.Model exposing ( Todo )


initialModel : ( Model, MbTask Action )
initialModel =
  ( { todo =
      { id = 0
      , priority = 0
      , description = ""
      }
    , validationErrors = [ ]
    }
  , Nothing
  )


actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp


update : Tasks -> Action -> Model -> ( Model, MbTask Action )
update tasks action model =
  case action of
    NoOp ->
      ( model, Nothing )

    Edit todo ->
      ( { todo = todo, validationErrors = [ ] }, Nothing )

    Cancel ->
      initialModel

    Save todo ->
      ( model, Just ( tasks.saveTodo todo |> Task.map UpdateList ) )

    UpdateList _ ->
      initialModel
