var Rx = require("rx");
var validation = require("./validation");

module.exports = function(events) {
  var validation$ = events.saveTodo$.map(function(todo) {
    return {todo: todo, validationErrors: validation(todo)};
  });

  var valid$ = validation$.filter(function(model) {
    return !model.validationErrors;
  });

  var invalid$ = validation$.filter(function(model) {
    return !!model.validationErrors;
  });

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
    .merge(events.cancelTodo$.map(returnBlankForm))
    .share();

  return {
    formModel$: formModel$,
    valid$: valid$
  };
};

