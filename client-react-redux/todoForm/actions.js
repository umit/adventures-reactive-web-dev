import {createAction} from "redux-actions";
import validation from "./validation";

const actions = function(ajax, todoUrl) {
  return {
    inFormAction: createAction("ACTION_IN_FORM"),

    saveAction: createAction("ACTION_SAVE", function(todo) {
      const validationErrors = validation(todo);

      if (validationErrors) {
        return { validationErrors };
      }
      return {
        promise: ajax.postJSON(todoUrl.save, todo)
      };
    }),

    cancelAction: createAction("ACTION_CANCEL")
  };
};

export default actions;
