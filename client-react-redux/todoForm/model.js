import {assoc} from "ramda";

export default function(model, action) {
  if (action) {
    if (action.type === "ACTION_EDIT" || action.type === "ACTION_IN_FORM") {
      return action.payload;
    }
    else if (action.type === "ACTION_SAVE" && action.payload.validationErrors) {
      return assoc("validationErrors", action.payload.validationErrors, model);
    }
    else if (action.type === "ACTION_CANCEL") {
      return {};
    }
  }
  return model || {};
};

