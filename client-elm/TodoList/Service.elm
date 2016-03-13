module TodoList.Service (loadTodos, deleteTodo) where

import Common.Model exposing (Todo)
import Effects exposing (Never)
import Http exposing (Request, defaultSettings, empty, fromJson)
import Json.Decode as Json exposing ((:=))
import Task exposing (Task, map, onError, succeed)
import TodoList.Model exposing (Model)


jsonTodoList : Json.Decoder (List Todo)
jsonTodoList =
  let
    todoItem =
      Json.object3
        Todo
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
  , url = "/api/deleteTodo/" ++ (toString todoId)
  , body = empty
  }


deleteTodoHttp : Int -> Task Http.RawError Int
deleteTodoHttp todoId =
  Http.send defaultSettings (deleteTodoRequest todoId)
    |> Task.map (always todoId)


errorMessage : Http.Error -> Task Never Model
errorMessage =
  always (succeed { todos = [], message = "An error occurred." })


loadTodos : Task Never Model
loadTodos =
  loadTodosHttp `onError` errorMessage


handleError : Http.RawError -> Task Never (Maybe Int)
handleError =
  always (succeed Nothing)


deleteTodo : Int -> Task Never (Maybe Int)
deleteTodo todoId =
  (deleteTodoHttp todoId |> Task.map Just) `onError` handleError

