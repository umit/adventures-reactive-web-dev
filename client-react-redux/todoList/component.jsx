import React from "react";

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
      <tr key={todo.id}>
        <td>{todo.priority}</td>
        <td>{todo.description}</td>
        <td>
          <button className="btn btn-primary btn-xs editBtn" onClick={onEdit(todo)}>Edit</button>
          <span> </span>
          <button className="btn btn-danger btn-xs deleteBtn" onClick={onDelete(todo)}>Delete</button>
        </td>
      </tr>
    );
  };

  const inProgressIndicator = function(props) {
    return props.todos.inProgress ? <tr><td colSpan="3">Loading, please wait...</td></tr> : undefined;
  };

  return (
    <div>
      <div>Todo List:</div>
      <table className="table">
        <thead>
          <tr>
            <th>Priority</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inProgressIndicator(props)}
          {props.todos.list.map(renderTodo)}
        </tbody>
      </table>
    </div>
  );
};
