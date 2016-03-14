module TodoSummary.View (..) where

import Common.Model exposing (Todo)
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (class)
import TodoSummary.Action exposing (Action)


totalPriority : List Todo -> Int
totalPriority todos =
  List.map .priority todos |> List.sum


view : Signal.Address Action -> List Todo -> Html
view address todos =
  let
    totalTodos =
      List.length todos

    averagePriority =
      toFloat (totalPriority todos) / toFloat totalTodos
  in
    div
      [ class "row" ]
      [ div
          [ class "col-md-8" ]
          [ div
              []
              [ span
                  []
                  [ text
                      ("Total todos: "
                        ++ toString totalTodos
                        ++ " Average priority: "
                        ++ toString averagePriority
                      )
                  ]
              ]
          ]
      ]

