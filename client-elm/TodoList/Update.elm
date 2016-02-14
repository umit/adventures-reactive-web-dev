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
import Task exposing (Task, andThen, fail, map, onError, succeed, toMaybe)

import TodoList.Model exposing (Model, Todo)

type Action =
    NoOp
  | ShowList Model


update : Action -> Model -> Model
update action model =
  case action of
    NoOp ->
      model

    ShowList todoModel ->
      todoModel


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


jsonTodoList : Json.Decoder (List Todo)
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
      map
        (\todos -> {todos=todos, message=""})
        (Http.get jsonTodoList "/todoList")
        -- (Http.get jsonTodoList "/todoListERROR")
    else
      succeed {todos=[], message="Waiting..."}


{--
sendList : (Maybe Model) -> Task x ()
sendList =
  (withDefault {todos=[], message="An error occurred."})
  >> ShowList
  >> Signal.send actions.address


runLoadTodos : Bool -> Task Http.Error ()
runLoadTodos indicator =
  (loadTodos indicator |> toMaybe) `andThen` sendList
--}


sendList : Model -> Task x ()
sendList = ShowList
  >> Signal.send actions.address


defaultList : Http.Error -> Task x Model
defaultList =
  always (succeed {todos=[], message="An error occurred."})


runLoadTodos : Bool -> Task Http.Error ()
runLoadTodos indicator =
  (loadTodos indicator) `onError` defaultList `andThen` sendList


