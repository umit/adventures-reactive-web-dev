import {assoc} from "ramda";
import handleAction from "../util/handle-action";

const initialState = {};

const handlers = [
  {
    test: function(model, action) {
      return action.type === "ACTION_EDIT";
    },
    handle: function(model, action) {
      return action.payload;
    }
  },
  {
    test: function(model, action) {
      return action.type === "ACTION_IN_FORM";
    },
    handle: function(model, action) {
      return assoc("validationErrors", model.validationErrors, action.payload);
    }
  },
  {
    test: function(model, action) {
      return action.type === "ACTION_SAVE" && action.payload.validationErrors;
    },
    handle: function(model, action) {
      return assoc("validationErrors", action.payload.validationErrors, model);
    }
  },
  {
    test: function(model, action) {
      return action.type === "ACTION_CANCEL" || action.type.endsWith("FULFILLED");
    },
    handle: function(model, action) {
      return {};
    }
  }
];

export default function(model = initialState, action) {
  return handleAction(model, action, handlers);
};

