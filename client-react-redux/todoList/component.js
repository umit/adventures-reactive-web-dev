import React from "react-dom";

const DOM = React.DOM;

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
      DOM.tr({key:todo.id}, [
        DOM.td(null, todo.priority),
        DOM.td(null, todo.description),
        DOM.td([
          DOM.button({className:"btn btn-primary btn-xs editBtn", onClick:onEdit(todo)}, "Edit"),
          DOM.span(" "),
          DOM.button({className:"btn btn-danger btn-xs deleteBtn", onClick:onDelete(todo)}, "Delete")])])
    );
  };

  const inProgressIndicator = function(props) {
    return props.todos.inProgress ? DOM.tr(DOM.td({colSpan:"3"}, "Loading, please wait...")) : undefined;
  };

  return DOM.div([
    DOM.div("Todo List:"),
    DOM.table({className:"table"}, [
      DOM.thead([
        DOM.tr([
          DOM.th("Priority"),
          DOM.th("Description"),
          DOM.th("Action")])]),
      DOM.tbody([
        inProgressIndicator(props),
        ...props.todos.list.map(renderTodo)])
    ])]);
};
