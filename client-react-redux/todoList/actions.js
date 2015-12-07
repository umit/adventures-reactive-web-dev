import {createAction} from "redux-actions";

const actions = function(ajax, todoUrl) {
  return {
    editAction: createAction("ACTION_EDIT"),

    deleteAction: createAction("ACTION_DELETE", function(todo) {
      return {promise: ajax.deleteJSON(todoUrl.delete(todo.id))};
    })
  };
};

export default actions;
