export default function(model, action) {
  if (action) {
    if (action.type === "ACTION_EDIT") {
      return action.payload;
    }
  }
  return model || {};
};

