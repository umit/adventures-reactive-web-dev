var Kefir = require("kefir");
var match = require("../util/match");

module.exports = function(element) {
  var clicks$ = Kefir.fromEvents(element, "click");

  var getTodoId = function(evt) {
    return parseInt(evt.target.dataset.todoId, 10);
  };

  return {
    deleteTodo$: clicks$.filter(match(".deleteBtn")).map(getTodoId),
    editTodo$: clicks$.filter(match(".editBtn")).map(getTodoId)
  };
};
