import {h} from "yolk";
import {prop} from "ramda";

//export default function(todos, events$) {
export default function({props}) {
  const TodoItem = function({props, createEventHandler}) {
    const todo$ = props.todo;
    const events$ = props.events;
    const onEdit = createEventHandler();

    onEdit.combineLatest(todo$, function(evt, todo) {
      events$.map(events => events.editTodo$.onNext(todo));
      return {evt, todo};
    }).subscribe(obj => console.log(obj));
/*
    const onEdit$ = function(todo) {
      return function(evt) {
        evt.preventDefault();
        events$.editTodo$.onNext(todo);
      }
    };
*/

    const onDelete = createEventHandler();

/*
    const onDelete$ = function(todo) {
      return function(evt) {
        evt.preventDefault();
        events$.deleteTodo$.onNext(todo.id);
      }
    };
*/

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
