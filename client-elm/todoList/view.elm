module TodoList.View where

-- import Html exposing (button, div, table, tbody, text, th, thead, td, tr)
import Html exposing (..)
import Html.Attributes as Attr
import StartApp.Simple as StartApp

type alias Todo = { id: Int, priority: Int, description: String }

model : List Todo
model = [
  {id = 1, priority = 1, description = "Learn Elm"},
  {id = 2, priority = 1, description = "Implement Todo List"},
  {id = 3, priority = 2, description = "Compare with JS"},
  {id = 4, priority = 4, description = "Thrive"} ]

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

view address todos =
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

type Action = Increment | Decrement

update action model = model

main =
  StartApp.start { model = model, view = view, update = update }
