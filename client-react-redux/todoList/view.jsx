import React from "react";
import {connect} from "react-redux";
import {identity} from "ramda";

const View = function(props) {
  const onEdit = todo => evt => {
    evt.preventDefault();
    props.dispatch(props.actions.editTodo(todo));
  };

  const onDelete = todo => evt => {
    evt.preventDefault();
    props.dispatch(props.actions.deleteTodo(todo));
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
    <div className="row">
      <div className="col-md-8">
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
    </div>
  );
};

const mapStateToProps = identity;

export default connect(mapStateToProps)(View);
