const todoUrl = {
  get: "/todoList",
  save: "/saveTodo",
  delete: function(todoId) {
    return "deleteTodo/" + String(todoId);
  }
};

export default function(ajax, events, formModel) {
  const todoListAfterDelete$ = events.deleteTodo$
    .map(todoUrl.delete)
    .flatMap(ajax.deleteJSON);

  const todoListAfterSave$ = formModel.valid$
    .flatMap(function(model) {
      return ajax.postJSON(todoUrl.save, model.todo);
    });

  const listModel$ = ajax.getJSON(todoUrl.get)
    .merge(todoListAfterDelete$)
    .merge(todoListAfterSave$)
    .share();

  return listModel$;
};

