module Hello where

import Html exposing (div, span, button, text)
import Html.Events exposing (onClick)
import Html.Attributes exposing (attribute)
import StartApp.Simple as StartApp

main =
  StartApp.start { model = model, view = view, update = update }

model = 0

primaryBtn = (attribute "class" "btn btn-sm btn-primary")

view address model =
  div []
    [ button [ (onClick address Decrement), primaryBtn ] [ text "Decr" ]
    , span [] [ text " "]
    , span [] [ text (toString model) ]
    , span [] [ text " "]
    , button [ (onClick address Increment), primaryBtn ] [ text "Incr" ]
    ]

type Action = Increment | Decrement

update action model =
  case action of
    Increment -> model + 1
    Decrement -> model - 1
