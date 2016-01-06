import React from "react";

const View = function(props) {
  const onEdit = function(todo) {
    return (evt) => {
      evt.preventDefault();
      props.dispatch(props.actions.editTodo(todo));
    };
  };

  const onDelete = function(todo) {
    return (evt) => {
      evt.preventDefault();
      props.dispatch(props.actions.deleteTodo(todo));
    };
  };

  const renderTodo = function(todo) {
    return (
      <tr key={todo.id}>
        <td>{todo.priority}</td>
        <td>{todo.description}</td>
        <td>
          <button className="btn btn-primary btn-xs" onClick={onEdit(todo)}>Edit</button>
          <span> </span>
          <button className="btn btn-danger btn-xs" onClick={onDelete(todo)}>Delete</button>
        </td>
      </tr>
    );
  };

  const todos = props.list.todos;

  const inProgressIndicator = function(props) {
    return props.list.inProgress ?
        <tr><td colSpan="3">Loading, please wait...</td></tr>
      : null;
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
          {todos.map(renderTodo)}
        </tbody>
      </table>
    </div>
  );
};

export default View;
