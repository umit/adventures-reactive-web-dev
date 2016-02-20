module TodoList.Update
  ( Action(..)
  , MbTask
  , actions
  , initialModel
  , update
  ) where

import Http
import Json.Decode as Json exposing ((:=))
import Maybe exposing (Maybe)
import Task exposing (Task, map, onError, succeed)
import Effects exposing (Never)

import TodoList.Model exposing (Model, Todo)


type Action
  = LoadList
  | ShowList Model

type alias MbTask = Maybe (Task Never Action)


initialModel : (Model, MbTask)
initialModel =
  ({todos=[], message="Initializing..."}, Nothing)


update : Action -> Model -> (Model, MbTask)
update action _ =
  case action of
    LoadList ->
      ({todos=[], message="Loading, please wait..."}, Just runLoadTodos)

    ShowList model ->
      (model, Nothing)


actions : Signal.Mailbox Action
actions =
  Signal.mailbox (ShowList {message="WE NEVER SEE THIS", todos=[]})


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


runLoadTodos : Task Never Action
runLoadTodos =
  (loadTodos `onError` errorMessage) |> Task.map ShowList
