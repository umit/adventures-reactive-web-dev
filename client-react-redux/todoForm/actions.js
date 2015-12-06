import {createAction} from "redux-actions";

const actions = function() {
  return {
    inFormTodoAction: createAction("ACTION_IN_FORM"),
    saveTodoAction: createAction("ACTION_SAVE")
  };
};

export default actions;
