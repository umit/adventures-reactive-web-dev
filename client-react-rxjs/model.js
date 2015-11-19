var Rx = require("rx");
var todoUrl = require("./todoUrl");
var validation = require("./validation");

module.exports = function(ajax, events) {
  var todoListAfterDelete$ = events.deleteTodo$
    .map(todoUrl.delete)
    .flatMap(ajax.deleteJSON);

  var validation$ = events.saveTodo$.map(function(todo) {
    return {todo: todo, validationErrors: validation(todo)};
  });

  var valid$ = validation$.filter(function(model) {
    return !model.validationErrors;
  });

  var invalid$ = validation$.filter(function(model) {
    return !!model.validationErrors;
  });

  var todoListAfterSave$ = valid$
    .flatMap(function(model) {
      return ajax.postJSON(todoUrl.save, model.todo);
    });

  var listModel$ = ajax.getJSON(todoUrl.get)
    .merge(todoListAfterDelete$)
    .merge(todoListAfterSave$);

  var blankForm = {
    todo: {},
    validationErrors: {}
  };

  var returnBlankForm = function() {
    return blankForm;
  };

  var formModel$ = Rx.Observable
    .return(blankForm)
    .merge(events.editTodo$.map(function(todo) {
      return {todo: todo, validationErrors: {}};
    }))
    .merge(events.inFormEdit$)
    .merge(invalid$)
    .merge(valid$.map(returnBlankForm))
    .merge(events.cancelTodo$.map(returnBlankForm));

  return {
    listModel$: listModel$,
    formModel$: formModel$
  };
};

