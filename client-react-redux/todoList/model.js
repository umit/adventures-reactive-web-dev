import handleAction from "../util/handle-action";

const initialState = {inProgress: false, list: []};

const handlers = [
  {
    test: function(model, action) {
      return action.type.endsWith("PENDING");
    },
    handle: function(model, action) {
      return {inProgress: true, list: []};
    }
  },
  {
    test: function(model, action) {
      return action.type.endsWith("FULFILLED");
    },
    handle: function(model, action) {
      return {inProgress: false, list: action.payload};
    }
  }
];

export default function(model = initialState, action) {
  return handleAction(model, action, handlers);
};

