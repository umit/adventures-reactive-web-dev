module TodoList.View where

-- import Html exposing (button, div, table, tbody, text, th, thead, td, tr)
import Html exposing (..)
import Html.Attributes as Attr
import StartApp.Simple as StartApp

import Http
import Json.Decode as Json exposing ((:=))
import Task exposing (..)

type alias Todo = { id: Int, priority: Int, description: String }
type alias Model = List Todo

init : Model
init = []

type Action = NoOp | LoadList Model

update : Action -> Model -> Model
update action model =
  case action of
    NoOp ->
      model

    LoadList todos ->
      todos

actions : Signal.Mailbox Action
actions = Signal.mailbox NoOp

model : Signal Model
model = Signal.foldp update init actions.signal

renderTodo : Todo -> Html
renderTodo todo =
  tr []
  [ td [] [ todo.priority |> toString |> text ]
  , td [] [ todo.description |> text ]
  , td []
    [ button [ Attr.class "btn btn-primary btn-xs" ] [ text "Edit" ]
    , span [] [ text " " ]
    , button [ Attr.class "btn btn-danger btn-xs" ] [ text "Delete" ]
    ]
  ]

view : Model -> Html
view todos =
  div [ Attr.class "row" ]
  [ div [ Attr.class "col-md-8" ]
    [ div [] [ text "Todo List:"]
    , table [ Attr.class "table" ]
      [ thead []
        [ tr []
          [ th [] [ text "Priority" ]
          , th [] [ text "Description" ]
          , th [] [ text "Action" ]
          ]
        ]
      , tbody [] (List.map renderTodo todos)
      ]
    ]
  ]

main : Signal Html
main = Signal.map view model

jsonTodoList : Json.Decoder (List Todo)
jsonTodoList =
  let todoItem =
    Json.object3 Todo
        ("id" := Json.int)
        ("priority" := Json.int)
        ("description" := Json.string)
  in
    Json.list todoItem

loadTodos : Task Http.Error (List Todo)
loadTodos = Http.get jsonTodoList "/todoList"

port runLoadTodos : Task Http.Error ()
port runLoadTodos =
  loadTodos `andThen` (LoadList >> Signal.send actions.address)

