import {createAction} from "redux-actions";

const actions = function(ajax, todoUrl) {
  return {
    loadTodos: createAction("ACTION_LIST", () => ({promise: ajax.getJSON(todoUrl.get)})),

    editTodo: createAction("ACTION_EDIT"),

    deleteTodo: createAction("ACTION_DELETE",
      todo => ({promise: ajax.deleteJSON(todoUrl.delete(todo.id))}))
  };
};

export default actions;
