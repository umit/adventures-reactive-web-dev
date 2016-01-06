import {createAction} from "redux-actions";
import validation from "./validation";

const actions = function(ajax, todoUrl) {
  return {
    inFormEdit: createAction("ACTION_IN_FORM_EDIT"),

    saveTodo: createAction("ACTION_SAVE", function(form) {
      const validationErrors = validation(form.todo);

      return validationErrors ? {validationErrors}
        : {promise: ajax.postJSON(todoUrl.save, form.todo)};
    }),

    cancelForm: createAction("ACTION_CANCEL")
  };
};

export default actions;
