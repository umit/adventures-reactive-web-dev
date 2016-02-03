module TodoList.View where

import Html exposing (Html, button, div, span, table, tbody, text, th, thead, td, tr)
import Html.Attributes as Attr
import Html.Events exposing (on, onClick, targetValue)
import Http
import Json.Decode as Json exposing ((:=))
import Task exposing (Task, andThen, fail, mapError, onError, succeed)

type alias Todo = { id: Int, priority: Int, description: String }
type alias Model = List Todo

initialModel : List Todo
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


-- andThen : Task x a -> (a -> Task x b) -> Task x b
-- toResult : Task x a -> Task never (Result x a)
-- send : Address a -> a -> Task x ()
-- message : Address a -> a -> Message


jsonTodoList : Json.Decoder Model
jsonTodoList =
  let todoItem =
    Json.object3 Todo
        ("id" := Json.int)
        ("priority" := Json.int)
        ("description" := Json.string)
  in
    Json.list todoItem


loadTodos : Model -> Task Http.Error Model
loadTodos _ =
  Http.get jsonTodoList "/todoList"


handleError : Task Http.Error Model -> Task Model Model
handleError =
  mapError (always [])


toLoadTask : Bool -> Task Model Model
toLoadTask needValue =
  if needValue then
    fail []
  else
    succeed []


sendList : Model -> Task x ()
sendList =
  ShowList >> Signal.send actions.address


runLoadTodos : Bool -> Task Model ()
runLoadTodos value =
  (toLoadTask value `onError` (loadTodos >> handleError)) `andThen` sendList


port portRunLoadTodos : Signal (Task Model ())
port portRunLoadTodos =
  Signal.map runLoadTodos onLoadTodos.signal

