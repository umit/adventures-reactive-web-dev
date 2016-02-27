module TodoList.Service
  ( loadTodos
  ) where

import Effects exposing (Never)
import Http exposing (Request, defaultSettings, empty, fromJson)
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


intoModel : List Todo -> Model
intoModel todos =
  { todos = todos
  , message = ""
  }


loadTodosHttp : Task Http.Error Model
loadTodosHttp =
  map intoModel (Http.get jsonTodoList "/todoList")
    -- (Http.get jsonTodoList "/todoListERROR")


deleteTodoRequest : Int -> Request
deleteTodoRequest todoId =
  { verb = "DELETE"
  , headers = [ ( "Content-Type", "application/json" ) ]
  , url = "/deleteTodo/" ++ (toString todoId)
  , body = empty
  }


deleteTodoHttp : Int -> Task Http.Error Model
deleteTodoHttp todoId =
  map intoModel
  ( Http.send defaultSettings (deleteTodoRequest todoId)
    |> fromJson jsonTodoList
  )


errorMessage : Http.Error -> Task Never Model
errorMessage =
  always (succeed {todos=[], message="An error occurred."})


loadTodos : Task Never Model
loadTodos =
  loadTodosHttp `onError` errorMessage
