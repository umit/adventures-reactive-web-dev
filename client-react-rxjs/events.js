var Rx = require("rx");

module.exports = function() {
  return {
    deleteTodo$: new Rx.Subject(),
    saveTodo$: new Rx.Subject(),
    editTodo$: new Rx.Subject(),
    inFormEdit$: new Rx.Subject(),
    cancelTodo$: new Rx.Subject()
  };
};
