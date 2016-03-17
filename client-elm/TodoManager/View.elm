module TodoManager.View (view) where

import Html exposing (Html, div)


view : Html -> Html -> Html
view todoListView todoFormView =
  div
    []
    [ todoFormView
    , todoListView
    ]

