export default function(model, action) {
  if (action) {
    if (action.type === "ACTION_LIST") {
      return action.payload;
    }
  }
  return model || {todos: []};
};

