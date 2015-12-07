import {createAction} from "redux-actions";

const actions = function(ajax, todoUrl) {
  return {
    inFormAction: createAction("ACTION_IN_FORM"),
    saveAction: createAction("ACTION_SAVE", function(todo) {
      return {promise: ajax.postJSON(todoUrl.save, todo)};
    }),
    cancelAction: createAction("ACTION_CANCEL")
  };
};

export default actions;
