module TodoForm.Service (saveTodo) where

import Common.Model exposing (Todo)
import Effects exposing (Never)
import Http exposing (empty, fromJson)
import Json.Decode as Json exposing ((:=))
import Json.Encode exposing (Value, encode, object)
import Task exposing (Task, onError, succeed)


jsonTodo : Json.Decoder Todo
jsonTodo =
  Json.object3
    Todo
    ("id" := Json.int)
    ("priority" := Json.int)
    ("description" := Json.string)


toJson : Todo -> List ( String, Value )
toJson todo =
  [ ( "id", Json.Encode.int todo.id )
  , ( "priority", Json.Encode.int todo.priority )
  , ( "description", Json.Encode.string todo.description )
  ]


saveTodoHttp : Todo -> Task Http.Error Todo
saveTodoHttp todo =
  Http.post
    jsonTodo
    "/api/saveTodo"
    (toJson todo |> object |> encode 0 |> Http.string)


handleError : Http.Error -> Task Never (Maybe Todo)
handleError =
  always (succeed Nothing)


saveTodo : Todo -> Task Never (Maybe Todo)
saveTodo todo =
  (saveTodoHttp todo |> Task.map Just) `onError` handleError

