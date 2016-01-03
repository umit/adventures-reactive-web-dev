import {h} from "yolk";

export default function(todos, events$) {
  const onEdit = function(todo) {
    return function(evt) {
      evt.preventDefault();
      events$.editTodo$.onNext(todo);
    }
  };

  const onDelete = function(todo) {
    return function(evt) {
      evt.preventDefault();
      events$.deleteTodo$.onNext(todo.id);
    }
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

  return (
    <div>
      <div>Todo List:</div>
      <table className="table ng-table">
        <thead>
          <tr>
            <th>Priority</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {todos.map(renderTodo)}
        </tbody>
      </table>
    </div>
  );
};
