import {createAction} from "redux-actions";

const actions = function(ajax, todoUrl) {
  return {
    getTodosAction: createAction("ACTION_LIST", function() {
      return {
        promise: ajax.getJSON(todoUrl.get)
      };
    }),

    editAction: createAction("ACTION_EDIT"),

    deleteAction: createAction("ACTION_DELETE", function(todo) {
      return {
        promise: ajax.deleteJSON(todoUrl.delete(todo.id))
      };
    })
  };
};

export default actions;
