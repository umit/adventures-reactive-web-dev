import {createAction} from "redux-actions";
import validation from "./validation";

const actions = function(ajax, todoUrl) {
  return {
    inFormEdit: createAction("ACTION_IN_FORM"),

    saveTodo: createAction("ACTION_SAVE", function(todo) {
      const validationErrors = validation(todo);

      if (validationErrors) {
        return { validationErrors };
      }
      return {
        promise: ajax.postJSON(todoUrl.save, todo)
      };
    }),

    cancelForm: createAction("ACTION_CANCEL")
  };
};

export default actions;
