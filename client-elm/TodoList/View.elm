module TodoList.View
  ( view
  ) where

import Html exposing (Html, button, div, span, table, tbody, text, th, thead, td, tr)
import Html.Attributes as Attr
import Html.Events exposing (on, onClick, targetValue)

import TodoList.Model exposing (Model, Todo)
import TodoList.Action exposing (Action(..))


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


view : Signal.Address Action -> Model -> Html
view address model =
  div [ Attr.class "row" ]
  [ div [ Attr.class "col-md-8" ]
    [ div []
      [ button
        [ Attr.class "btn btn-primary btn-sm"
        , onClick address LoadList
        ]
        [ text "Load Todos" ]
      ]
    , div [] [ span [] [ text "Todo List: " ], span [] [ text model.message ] ]
    , table [ Attr.class "table" ]
      [ thead []
        [ tr []
          [ th [] [ text "Priority" ]
          , th [] [ text "Description" ]
          , th [] [ text "Action" ]
          ]
        ]
      , tbody [] (List.map renderTodo model.todos)
      ]
    ]
  ]
