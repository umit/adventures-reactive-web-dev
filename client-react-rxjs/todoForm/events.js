var Rx = require("rx");

module.exports = function() {
  return {
    saveTodo$: new Rx.Subject(),
    inFormEdit$: new Rx.Subject(),
    cancelTodo$: new Rx.Subject()
  };
};
