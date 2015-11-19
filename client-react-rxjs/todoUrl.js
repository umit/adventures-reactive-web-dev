module.exports = {
  get: "/todoList",

  save: "/saveTodo",

  delete: function(todoId) {
    return "deleteTodo/" + String(todoId);
  }
};

