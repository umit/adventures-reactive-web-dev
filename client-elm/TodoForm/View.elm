module TodoForm.View
  ( view
  ) where

import Html exposing (Html, button, div, form, input, label, span, text)
import Html.Attributes exposing (class, for, name, type', value)
import Html.Events exposing (on, onWithOptions, targetValue)

import TodoForm.Action exposing (Action(Cancel, Edit, Save))
import TodoForm.Model exposing (Model)
import TodoList.Model exposing (Todo)


intoDesc : Todo -> String -> Todo
intoDesc todo desc =
  {todo | description = desc}


view : Signal.Address Action -> Model -> Html
view address model =
  div [ class "row" ]
  [ div [ class "col-md-4" ]
    [ form []
      [ input [ type' "hidden", name "id", value "0" ] []
      , div [ class "form-group" ]
        [ label [ for "priority" ] [ text "Priority:" ]
        , input
          [ class "form-control"
          , value (toString model.todo.priority)
          ]
          []
        , span [ class "help-block" ] [ text "" ]
        ]
      , div [ class "form-group" ]
        [ label [ for "description" ] [ text "Description:" ]
        , input
          [ class "form-control"
          , value model.todo.description
          , on "change" targetValue (\str -> Signal.message address (Edit (intoDesc model.todo str)))
          ]
          []
        , span [ class "help-block" ] [ text "" ]
        ]
      , div []
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
            (\_ -> Signal.message address Cancel)
          ]
          [ text "Cancel" ]
        ]
      ]
    ]
  ]
