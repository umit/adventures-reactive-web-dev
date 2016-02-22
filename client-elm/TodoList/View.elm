module TodoList.View
  ( view
  ) where

import Html exposing (Html, button, div, span, table, tbody, text, th, thead, td, tr)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

import TodoList.Model exposing (Model, Todo)
import TodoList.Action exposing (Action(DeleteTodo, EditTodo, LoadList))


renderTodo : Signal.Address Action -> Todo -> Html
renderTodo address todo =
  tr []
  [ td [] [ todo.priority |> toString |> text ]
  , td [] [ todo.description |> text ]
  , td []
    [ button
      [ class "btn btn-primary btn-xs"
      , onClick address (EditTodo todo)
      ]
      [ text "Edit" ]
    , span [] [ text " " ]
    , button
      [ class "btn btn-danger btn-xs"
      , onClick address (DeleteTodo (.id todo))
      ]
      [ text "Delete" ]
    ]
  ]


view : Signal.Address Action -> Model -> Html
view address model =
  div [ class "row" ]
  [ div [ class "col-md-8" ]
    [ div []
      [ button
        [ class "btn btn-primary btn-sm"
        , onClick address LoadList
        ]
        [ text "Load Todos" ]
      ]
    , div [] [ span [] [ text "Todo List: " ], span [] [ text model.message ] ]
    , table [ class "table" ]
      [ thead []
        [ tr []
          [ th [] [ text "Priority" ]
          , th [] [ text "Description" ]
          , th [] [ text "Action" ]
          ]
        ]
      , tbody [] (List.map (renderTodo address) model.todos)
      ]
    ]
  ]
