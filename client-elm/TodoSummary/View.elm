module TodoSummary.View (..) where

import Common.Model exposing (Todo)
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (class)
import TodoSummary.Action exposing (Action)
import TodoSummary.Model exposing (Model)


totalPriority : List Todo -> Int
totalPriority todos =
  List.map .priority todos |> List.sum


view : Signal.Address Action -> Model -> Html
view address model =
  let
    totalTodos =
      List.length model.todos

    averagePriority =
      toFloat (totalPriority model.todos) / toFloat totalTodos
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
                        ++ " Last priority: "
                        ++ toString (model.lastSaved |> Maybe.map .priority |> Maybe.withDefault 0)
                      )
                  ]
              ]
          ]
      ]

