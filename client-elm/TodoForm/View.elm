module TodoForm.View (view) where

import Common.Model exposing (Todo)
import Html exposing (Html, button, div, form, input, label, span, text)
import Html.Attributes exposing (class, for, name, type', value)
import Html.Events exposing (on, onWithOptions, targetValue)
import Result exposing (withDefault)
import String exposing (toInt)
import TodoForm.Action exposing (Action(ClearForm, Edit, Save))
import TodoForm.Model exposing (Model)


intoPriority : Todo -> String -> Todo
intoPriority todo priorityStr =
  { todo | priority = toInt priorityStr |> withDefault 0 }


intoDesc : Todo -> String -> Todo
intoDesc todo desc =
  { todo | description = desc }


view : Signal.Address Action -> Model -> Html
view address model =
  div
    [ class "row" ]
    [ div
        [ class "col-md-4" ]
        [ form
            []
            [ input [ type' "hidden", name "id", value "0" ] []
            , div
                [ class "form-group" ]
                [ label [ for "priority" ] [ text "Priority:" ]
                , input
                    [ class "form-control"
                    , value (toString model.todo.priority)
                    , on "change" targetValue (\str -> Signal.message address (Edit (intoPriority model.todo str)))
                    ]
                    []
                ]
            , div
                [ class "form-group" ]
                [ label [ for "description" ] [ text "Description:" ]
                , input
                    [ class "form-control"
                    , value model.todo.description
                    , on "change" targetValue (\str -> Signal.message address (Edit (intoDesc model.todo str)))
                    ]
                    []
                ]
            , div
                []
                [ button
                    [ class "btn btn-primary btn-xs"
                    , onWithOptions
                        "click"
                        { preventDefault = True, stopPropagation = False }
                        targetValue
                        (always (Signal.message address (Save model.todo)))
                    ]
                    [ text "Save" ]
                , span [] [ text " " ]
                , button
                    [ class "btn btn-danger btn-xs"
                    , onWithOptions
                        "click"
                        { preventDefault = True, stopPropagation = False }
                        targetValue
                        (\_ -> Signal.message address ClearForm)
                    ]
                    [ text "ClearForm" ]
                ]
            ]
        ]
    ]

