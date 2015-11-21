var Kefir = require("kefir");
var validation = require("./validation");

module.exports = function(events, editTodo$) {
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

  var formModel$ = Kefir
    .sequentially(0, [blankForm])
    .merge(editTodo$)
    .merge(invalid$)
    .merge(valid$.map(returnBlankForm))
    .merge(events.cancelTodo$.map(returnBlankForm));

  return {
    formModel$: formModel$,
    valid$: valid$
  };
};

