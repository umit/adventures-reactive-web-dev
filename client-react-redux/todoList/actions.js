import {createAction} from "redux-actions";

const actions = function(ajax, todoUrl) {
  return {
    editTodoAction: createAction("ACTION_EDIT"),

    deleteTodoAction: createAction("ACTION_DELETE", function(todo) {
      return {promise: ajax.deleteJSON(todoUrl.delete(todo.id))};
    })
  };
};

export default actions;
