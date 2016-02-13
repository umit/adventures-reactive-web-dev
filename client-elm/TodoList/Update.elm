module TodoList.Update
  ( address
  , runLoadTodos
  , signalAction
  , signalLoad
  , update
  ) where

import Http
import Json.Decode as Json exposing ((:=))
import Maybe exposing (Maybe, withDefault)
import Task exposing (Task, andThen, fail, mapError, succeed, toMaybe)

import TodoList.Model exposing (Model, Todo)

type Action =
    NoOp
  | ShowList Model


update : Action -> Model -> Model
update action model =
  case action of
    NoOp ->
      model

    ShowList todos ->
      todos


actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp


signalAction : Signal Action
signalAction =
  actions.signal


onLoadTodos : Signal.Mailbox Bool
onLoadTodos =
  Signal.mailbox False


signalLoad : Signal Bool
signalLoad =
  onLoadTodos.signal


address : Signal.Address Bool
address =
  onLoadTodos.address


-- andThen : Task x a -> (a -> Task x b) -> Task x b
-- toResult : Task x a -> Task never (Result x a)
-- send : Address a -> a -> Task x ()
-- message : Address a -> a -> Message


jsonTodoList : Json.Decoder Model
jsonTodoList =
  let todoItem =
    Json.object3 Todo
        ("id" := Json.int)
        ("priority" := Json.int)
        ("description" := Json.string)
  in
    Json.list todoItem


loadTodos : Bool -> Task Http.Error Model
loadTodos indicator =
  if indicator then
    Http.get jsonTodoList "/todoList"
    -- Http.get jsonTodoList "/todoListERROR"
  else
    succeed [{id=0, priority=0, description="Waiting"}]


sendList : (Maybe Model) -> Task x ()
sendList =
  (withDefault [{id=0, priority=0, description="Error"}])
  >> ShowList
  >> Signal.send actions.address


runLoadTodos : Bool -> Task Http.Error ()
runLoadTodos indicator =
  (loadTodos indicator |> toMaybe) `andThen` sendList


