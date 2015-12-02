var todoUrl = {
  get: "/todoList",
  save: "/saveTodo",
  delete: function(todoId) {
    return "deleteTodo/" + String(todoId);
  }
};

module.exports = function(ajax) {
  return function(todoList, action) {
    return {
      todos: [
        {id: 1, priority: 1, description: "Buy beer"},
        {id: 2, priority: 1, description: "Order pizza"}
      ]
    };
  };
};

