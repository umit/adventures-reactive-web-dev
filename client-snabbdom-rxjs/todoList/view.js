const h = require("snabbdom/h");
const {button, div, span, table, tbody, text, th, thead, td, tr} =
  require("hyperscript-helpers")(h);

// renderTodo : Todo -> Html
const renderTodo = todo =>
  tr([
    td(String(todo.priority)),
    td(todo.description),
    td([
      button(".btn.btn-primary.btn-xs", "Edit"),
      span(" "),
      button(".btn.btn-danger.btn-xs", "Delete")
    ])
  ]);

// view : Signal.Address Bool -> Model -> Html
const view = address => todos =>
  div(".row", [
    div(".col-md-8", [
      div([
        button(".btn.btn-primary.btn-sm",
          {on: {click: address}},
          "Load Todos")
      ]),
      div("Todo List:"),
      table(".table", [
        thead([
          tr([
            th("Priority"),
            th("Description"),
            th("Action")
          ])
        ]),
        tbody(todos.map(renderTodo))
      ])
    ])
  ]);

export default view;
