var React = require("react");

module.exports = function(props) {
  var renderTodo = function(todo) {
    return (
      <tr key={todo.id}>
        <td>{todo.priority}</td>
        <td>{todo.description}</td>
        <td>
          <button className="btn btn-primary btn-xs editBtn">Edit</button>
          <span> </span>
          <button className="btn btn-danger btn-xs deleteBtn">Delete</button>
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
          {props.todos.map(renderTodo)}
        </tbody>
      </table>
    </div>
  );
};
