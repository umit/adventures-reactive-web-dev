import Rx from "rx";
import validation from "./validation";

export default function(events) {
  const validation$ = events.saveTodo$.map(function(todo) {
    return {todo: todo, validationErrors: validation(todo)};
  });

  const valid$ = validation$.filter(function(model) {
    return !model.validationErrors;
  });

  const invalid$ = validation$.filter(function(model) {
    return !!model.validationErrors;
  });

  const blankForm = {
    todo: {},
    validationErrors: {}
  };

  const returnBlankForm = function() {
    return blankForm;
  };

  const formModel$ = Rx.Observable
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

