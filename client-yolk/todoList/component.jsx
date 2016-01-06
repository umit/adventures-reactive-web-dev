import {h} from "yolk";
import {prop} from "ramda";

export default function(events) {
  return function({props}) {
    const TodoItem = function({props, createEventHandler}) {
      const todo$ = props.todo;

      const onEdit = createEventHandler();
      onEdit.withLatestFrom(todo$, (evt, todo) => todo).subscribe(events.editTodo$);

      const onDelete = createEventHandler();
      onDelete.withLatestFrom(todo$, (evt, todo) => todo.id).subscribe(events.deleteTodo$);

      return (
        <tr key={todo$.map(prop("id"))}>
          <td>{todo$.map(prop("id"))}</td>
          <td>{todo$.map(prop("description"))}</td>
          <td>
            <button className="btn btn-primary btn-xs" onClick={onEdit}>Edit</button>
            <span> </span>
            <button className="btn btn-danger btn-xs" onClick={onDelete}>Delete</button>
          </td>
        </tr>
      );
    };

    const renderTodo = todo => <TodoItem todo={todo} {...props}/>;

    const todos$ = props.todos;

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
            {todos$.map(todos => todos.map(renderTodo))}
          </tbody>
        </table>
      </div>
    );
  };
};
