const createAction = require("redux-actions").createAction;
import validation from "./validation";

const actions = function(ajax, todoUrl) {
  return {
    saveTodo: createAction("ACTION_SAVE", function(form) {
      const validationErrors = validation(form.todo);

      return validationErrors ? {validationErrors}
        : {promise: ajax.postJSON(todoUrl.save, form.todo)};
    }),

    cancelForm: createAction("ACTION_CANCEL")
  };
};

export default actions;
