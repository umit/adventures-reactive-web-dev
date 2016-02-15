module TodoList.Update
  ( Action(LoadList)
  , actions
  , runLoadTodos
  , update
  ) where

import Http
import Json.Decode as Json exposing ((:=))
import Maybe exposing (Maybe, withDefault)
import Task exposing (Task, andThen, fail, map, onError, succeed, toMaybe)

import TodoList.Model exposing (Model, Todo)

type Action =
    Waiting
  | LoadList
  | ShowList Model


update : Action -> Model -> Model
update action _ =
  case action of
    Waiting ->
      {todos=[], message="Waiting..."}

    LoadList ->
      {todos=[], message="Loading, please wait..."}

    ShowList model ->
      model


actions : Signal.Mailbox Action
actions =
  Signal.mailbox Waiting


jsonTodoList : Json.Decoder (List Todo)
jsonTodoList =
  let todoItem =
    Json.object3 Todo
        ("id" := Json.int)
        ("priority" := Json.int)
        ("description" := Json.string)
  in
    Json.list todoItem


loadTodos : Task Http.Error Model
loadTodos =
  map
    (\todos -> {todos=todos, message=""})
    (Http.get jsonTodoList "/todoList")
    -- (Http.get jsonTodoList "/todoListERROR")


sendList : Model -> Task x ()
sendList = ShowList
  >> Signal.send actions.address


errorMessage : Http.Error -> Task x Model
errorMessage =
  always (succeed {todos=[], message="An error occurred."})


runLoadTodos : Action -> Task Http.Error ()
runLoadTodos action =
  if action == LoadList then
    loadTodos `onError` errorMessage `andThen` sendList
  else
    succeed ()

