module TodoSummary.View where

import Html exposing (Html, div, span)


view : Signal Address.Action -> List Todo -> Html
view address todoList =
  div
    [ class "row" ]
    [ div
        [ class "col-md-8" ]
        [ div
          []


