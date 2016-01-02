import {createAction} from "redux-actions";

const actions = function(ajax, todoUrl) {
  return {
    loadTodos: createAction("ACTION_LIST", function() {
      return {
        promise: ajax.getJSON(todoUrl.get)
      };
    }),

    editTodo: createAction("ACTION_EDIT"),

    deleteTodo: createAction("ACTION_DELETE", function(todo) {
      return {
        promise: ajax.deleteJSON(todoUrl.delete(todo.id))
      };
    })
  };
};

export default actions;
