module TodoList.Service
  ( loadTodosAction
  ) where

import Effects exposing (Never)
import Http
import Json.Decode as Json exposing ((:=))
import Task exposing (Task, map, onError, succeed)

import TodoList.Action exposing (Action(ShowList))
import TodoList.Model exposing (Model, Todo)


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


errorMessage : Http.Error -> Task Never Model
errorMessage =
  always (succeed {todos=[], message="An error occurred."})


loadTodosAction : Task Never Action
loadTodosAction =
  (loadTodos `onError` errorMessage) |> Task.map ShowList
