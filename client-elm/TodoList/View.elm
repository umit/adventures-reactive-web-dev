module TodoList.View
  ( view
  ) where

import Html exposing (Html, button, div, span, table, tbody, text, th, thead, td, tr)
import Html.Attributes as Attr
import Html.Events exposing (on, onClick, targetValue)

import TodoList.Model exposing (Model, Todo)


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