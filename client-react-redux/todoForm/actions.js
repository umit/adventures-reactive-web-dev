import {createAction} from "redux-actions";

const actions = function(ajax, todoUrl) {
  return {
    inFormTodoAction: createAction("ACTION_IN_FORM"),
    saveTodoAction: createAction("ACTION_SAVE", function(todo) {
      return {promise: ajax.postJSON(todoUrl.save, todo)};
    })
  };
};

export default actions;
