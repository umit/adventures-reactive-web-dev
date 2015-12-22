import {assoc} from "ramda";

export default function(model, action) {
  if (action) {
    if (action.type === "ACTION_EDIT") {
      return action.payload;
    }
    else if (action.type === "ACTION_IN_FORM") {
      return assoc("validationErrors", model.validationErrors, action.payload);
    }
    else if (action.type === "ACTION_SAVE" && action.payload.validationErrors) {
      return assoc("validationErrors", action.payload.validationErrors, model);
    }
    else if (action.type === "ACTION_CANCEL" || action.type.endsWith("FULFILLED")) {
      return {};
    }
  }
  return model || {};
};

