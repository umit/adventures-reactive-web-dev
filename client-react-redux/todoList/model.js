export default function(model, action) {
  if (action) {
    if (action.type === "ACTION_LIST_PENDING") {
      return {inProgress: true, list: []};
    }
    else if (action.type === "ACTION_LIST_FULFILLED") {
      return {inProgress: false, list: action.payload};
    }
  }
  return {inProgress: false, list: []};
};

