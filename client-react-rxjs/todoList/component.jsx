var React = require("react");

module.exports = function(todos, events$) {
  var onEdit = function(todo) {
    return function(evt) {
      evt.preventDefault();
      events$.editTodo$.onNext(todo);
    }
  };  

  var onDelete = function(todo) {
    return function(evt) {
      evt.preventDefault();
      events$.deleteTodo$.onNext(todo.id);
    }
  };

  var renderTodo = function(todo) {
    return (
      <tr key={todo.id}>
        <td>{todo.priority}</td>
        <td>{todo.description}</td>
        <td>
          <button className="btn btn-primary btn-xs" data-action="edit" onClick={onEdit(todo)}>Edit</button>
          <button className="btn btn-danger btn-xs" data-action="delete" onClick={onDelete(todo)}>Delete</button>
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
