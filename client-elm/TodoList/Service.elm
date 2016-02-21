module TodoList.Service
  ( loadTodos
  ) where

import Effects exposing (Never)
import Http
import Json.Decode as Json exposing ((:=))
import Task exposing (Task, map, onError, succeed)

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


loadTodosHttp : Task Http.Error Model
loadTodosHttp =
  map
    (\todos -> {todos=todos, message=""})
    (Http.get jsonTodoList "/todoList")
    -- (Http.get jsonTodoList "/todoListERROR")


errorMessage : Http.Error -> Task Never Model
errorMessage =
  always (succeed {todos=[], message="An error occurred."})


loadTodos : Task Never Model
loadTodos =
  loadTodosHttp `onError` errorMessage
