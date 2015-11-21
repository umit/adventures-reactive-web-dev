var Kefir = require("kefir");
var match = require("../util/match");
var serialize = require("form-serialize");
var preventDefault = require("../util/preventDefault");

module.exports = function(element) {
  var getTodo = function(evt) {
    return serialize(evt.target.form, {hash: true});
  };

  var intoTodoObject = function(todo) {
    return {todo: todo};
  };

  var clicks$ = Kefir.fromEvents(element, "click").map(preventDefault);
  var changes$ = Kefir.fromEvents(element, "change");

  return {
    inFormEdit$: changes$.map(getTodo).map(intoTodoObject),
    saveTodo$: clicks$.filter(match(".saveBtn")).map(getTodo),
    cancelTodo$: clicks$.filter(match(".cancelBtn"))
  };
};
