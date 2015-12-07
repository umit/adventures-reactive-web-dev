export default function(model, action) {
  if (action) {
    if (action.type === "ACTION_EDIT" || action.type === "ACTION_IN_FORM") {
      return action.payload;
    }
    else if (action.type === "ACTION_CANCEL") {
      return {};
    }
  }
  return model || {};
};

