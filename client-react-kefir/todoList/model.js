var Kefir = require("kefir");
var R = require("ramda");

var todoUrl = {
  get: "/todoList",
  save: "/saveTodo",
  delete: function(todoId) {
    return "deleteTodo/" + String(todoId);
  }
};

module.exports = function(ajax, events, saveTodo$) {
  var todoListAfterDelete$ = events.deleteTodo$
    .map(todoUrl.delete)
    .flatMap(ajax.deleteJSON);

  var todoListAfterSave$ = saveTodo$
    .flatMap(function(model) {
      return ajax.postJSON(todoUrl.save, model.todo);
    });

  var todos$ = ajax.getJSON(todoUrl.get)
    .merge(todoListAfterDelete$)
    .merge(todoListAfterSave$);

  var editTodo$ = Kefir.combine([events.editTodo$], [todos$], function(editTodoId, todos) {
    return {todo: R.find(R.propEq("id", editTodoId))(todos)};
  });

  return {
    todos$: todos$,
    editTodo$: editTodo$
  };
};

