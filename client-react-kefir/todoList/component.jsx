var React = require("react");

module.exports = function(todos, events$) {
  var renderTodo = function(todo) {
    return (
      <tr key={todo.id}>
        <td>{todo.priority}</td>
        <td>{todo.description}</td>
        <td>
          <button className="btn btn-primary btn-xs editBtn" data-todo-id={todo.id}>Edit</button>
          <span> </span>
          <button className="btn btn-danger btn-xs deleteBtn" data-todo-id={todo.id}>Delete</button>
        </td>
      </tr>
    );
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
          {todos.map(renderTodo)}
        </tbody>
      </table>
    </div>
  );
};
