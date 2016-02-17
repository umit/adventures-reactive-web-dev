module TodoForm.View (
  view
  ) where

import Html exposing (Html, button, div, form, input, label, span, text)
import Html.Attributes exposing (class, for, name, type', value)
import Html.Events exposing (on, onClick, targetValue)

import TodoForm.Model exposing (Model)
import TodoForm.Update exposing (Action)


view : Signal.Address Action -> Model -> Html
view address model =
  div [ class "row" ]
  [ div [ class "col-md-4" ]
    [ form []
      [ input [ type' "hidden", name "id", value "0" ] []
      , div [ class "form-group" ]
        [ label [ for "priority" ] [ text "Priority:" ]
        , input [ class "form-control" ] []
        , span [ class "help-block" ] [ text "" ]
        ]
      ]
    ]
  ]

{--
    [ div [] [ button
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
      , tbody [] (List.map renderTodo model.todos)
      ]
    ]
  ]
    return div(".row",
      div(".col-md-4",
        form([
          input({type:"hidden", name:"id", value:todo.id}),
          div("." + (classNames.priority || "form-group"), [
            label({htmlFor:"priority"}, "Priority:"),
            input(".form-control", {type:"text", id:"priority", name:"priority", value:todo.priority}),
            span(".help-block", validationErrors.priority)
          ]),
          div("." + (classNames.description || "form-group"), [
            label({htmlFor:"description"}, "Description:"),
            input(".form-control", {type:"text", id:"description", name:"description", value:todo.description}),
            span(".help-block", validationErrors.description)
          ]),
          div([
            button(".btn.btn-primary.btn-xs.saveTodo", "Save"),
            span(" "),
            button(".btn.btn-danger.btn-xs.cancelTodo", "Cancel")
          ])
        ])
      )
    );
--}
