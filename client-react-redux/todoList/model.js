export default function(model, action) {
  if (action) {
    console.log("action:", JSON.stringify(action));
    if (action.type === "ACTION_LIST") {
      return action.payload || {inProgress: true};
    }
  }
  return model || [];
};

