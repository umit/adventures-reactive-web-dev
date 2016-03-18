module TodoMinMax.View (..) where

import Common.Model exposing (Todo)
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (class)
import TodoMinMax.Action exposing (Action)
import TodoMinMax.Model exposing (Model)


view : Signal.Address Action -> Model -> Html
view address model =
  let
    priorities =
      List.map .priority model.todos

    highestPriority =
      List.foldl min 100 priorities

    lowestPriority =
      List.foldl max 0 priorities
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
                      ("Highest priority: "
                        ++ toString highestPriority
                        ++ " Lowest priority: "
                        ++ toString lowestPriority
                      )
                  ]
              ]
          ]
      ]

