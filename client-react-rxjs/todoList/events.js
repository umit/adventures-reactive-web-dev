var Rx = require("rx");

module.exports = function() {
  return {
    deleteTodo$: new Rx.Subject(),
    editTodo$: new Rx.Subject()
  };
};
