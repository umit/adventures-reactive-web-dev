module TodoList.View where

import Html exposing (Html, button, div, span, table, tbody, text, th, thead, td, tr)
import Html.Attributes as Attr
import Html.Events exposing (on, onClick, targetValue)
import Http
import Json.Decode as Json exposing ((:=))
import Task exposing (Task, andThen)

type alias Todo = { id: Int, priority: Int, description: String }
type alias Model = List Todo

initialModel : Model
initialModel =
  []

type Action =
    NoOp
  | ShowList Model

update : Action -> Model -> Model
update action model =
  case action of
    NoOp ->
      model

    ShowList todos ->
      todos

actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp

onLoadTodos : Signal.Mailbox Bool
onLoadTodos =
  Signal.mailbox False

model : Signal Model
model =
  Signal.foldp update initialModel actions.signal

renderTodo : Todo -> Html
renderTodo todo =
  tr []
  [ td [] [ todo.priority |> toString |> text ]
  , td [] [ todo.description |> text ]
  , td []
    [ button
      [ Attr.class "btn btn-primary btn-xs" ]
      [ text "Edit" ]
    , span [] [ text " " ]
    , button [ Attr.class "btn btn-danger btn-xs" ] [ text "Delete" ]
    ]
  ]

view : Signal.Address Bool -> Model -> Html
view address todos =
  div [ Attr.class "row" ]
  [ div [ Attr.class "col-md-8" ]
    [ div [] [ button
               [ Attr.class "btn btn-primary btn-sm"
--             , on "click" targetValue (Signal.message address NoOp |> always)
               , onClick address True
               ]
               [ text "Load Todos" ]
             ]
    , div [] [ text "Todo List:"]
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
main =
  Signal.map (view onLoadTodos.address) model

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

{--
port runLoadTodos : Task Http.Error ()
port runLoadTodos =
  loadTodos `andThen` (ShowList >> Signal.send actions.address)
--}

runLoadTodos : Task Http.Error ()
runLoadTodos =
  loadTodos `andThen` (ShowList >> Signal.send actions.address)

