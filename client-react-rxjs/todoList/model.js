var todoUrl = {
  get: "/todoList",
  save: "/saveTodo",
  delete: function(todoId) {
    return "deleteTodo/" + String(todoId);
  }
};

module.exports = function(ajax, events, formModel) {
  var todoListAfterDelete$ = events.deleteTodo$
    .map(todoUrl.delete)
    .flatMap(ajax.deleteJSON);

  var todoListAfterSave$ = formModel.valid$
    .flatMap(function(model) {
      return ajax.postJSON(todoUrl.save, model.todo);
    });

  var listModel$ = ajax.getJSON(todoUrl.get)
    .merge(todoListAfterDelete$)
    .merge(todoListAfterSave$)
    .share();

  return listModel$;
};

