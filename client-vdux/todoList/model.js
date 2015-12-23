export default function(todoList, action) {
  if (action && action.type === "EVT_LIST") {
    return action.payload;
  }
  return {
    todos: [
      {id: 1, priority: 1, description: "Buy beer"},
      {id: 2, priority: 1, description: "Order pizza"}
    ]
  };
};

