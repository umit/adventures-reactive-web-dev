import React from "react";

const {button, div, span, table, tbody, td, th, thead, tr} = React.DOM;

export default function(props) {
  const onEdit = function(todo) {
    return function(evt) {
      evt.preventDefault();
      props.dispatch(props.actions.editAction(todo));
    }
  };

  const onDelete = function(todo) {
    return function(evt) {
      evt.preventDefault();
      props.dispatch(props.actions.deleteAction(todo));
    };
  };

  const renderTodo = function(todo) {
    return (
      tr({key:todo.id},
        td(null, todo.priority),
        td(null, todo.description),
        td(null,
          button({className:"btn btn-primary btn-xs editBtn", onClick:onEdit(todo)}, "Edit"),
          span(null, " "),
          button({className:"btn btn-danger btn-xs deleteBtn", onClick:onDelete(todo)}, "Delete")))
    );
  };

  const inProgressIndicator = function(props) {
    return props.todos.inProgress ? tr(null, td({colSpan:"3"}, "Loading, please wait...")) : undefined;
  };

  return div(null,
    div(null, "Todo List:"),
    table({className:"table"},
      thead(null,
        tr(null,
          th(null, "Priority"),
          th(null, "Description"),
          th(null, "Action"))),
      tbody(null,
        inProgressIndicator(props),
        ...props.todos.list.map(renderTodo))
    ));
};
