export default function(model, action) {
  if (action) {
    if (action.type.endsWith("PENDING")) {
      return {inProgress: true, list: []};
    }
    else if (action.type.endsWith("FULFILLED")) {
      return {inProgress: false, list: action.payload};
    }
  }
  return model || {inProgress: false, list: []};
};

