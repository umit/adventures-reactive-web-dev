var Kefir = require("kefir");
var match = require("../util/match");
var serialize = require("form-serialize");

module.exports = function(element) {
  var getTodo = function(evt) {
    return serialize(evt.target.form, {hash: true});
  };

  var clicks$ = Kefir.fromEvents(element, "click");

  return {
    saveTodo$: clicks$.filter(match(".saveBtn")).map(getTodo),
    inFormEdit$: Kefir.fromEvents(element, "keydown").filter(match(".form-control")),
    cancelTodo$: clicks$.filter(match(".cancelBtn"))
  };
};
