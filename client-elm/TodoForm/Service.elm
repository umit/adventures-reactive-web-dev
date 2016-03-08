module TodoForm.Service (saveTodo) where

import Effects exposing (Never)
import Http exposing (empty, fromJson)
import Json.Decode as Json exposing ((:=))
import Json.Encode exposing (Value, encode, object)
import Task exposing (Task, map, onError, succeed)
import TodoList.Model exposing (Model, Todo)


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


toJson : Todo -> List ( String, Value )
toJson todo =
  [ ( "id", Json.Encode.int todo.id )
  , ( "priority", Json.Encode.int todo.priority )
  , ( "description", Json.Encode.string todo.description )
  ]


saveTodoHttp : Todo -> Task Http.Error Model
saveTodoHttp todo =
  map intoModel (Http.post jsonTodoList "/saveTodo" (toJson todo |> object |> encode 0 |> Http.string))


errorMessage : Http.Error -> Task Never Model
errorMessage =
  always (succeed { todos = [], message = "An error occurred." })


saveTodo : Todo -> Task Never Model
saveTodo todo =
  (saveTodoHttp todo) `onError` errorMessage
