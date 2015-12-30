import {assoc} from "ramda";
import {handleActions} from "redux-actions";

const initialState = {};
const clearForm = () => ({});

const reducer = handleActions({
  "ACTION_EDIT": (model, action) => action.payload,
  "ACTION_IN_FORM": (model, action) => assoc("validationErrors", model.validationErrors, action.payload),
  "ACTION_SAVE": (model, action) => assoc("validationErrors", action.payload.validationErrors, model),
  "ACTION_CANCEL": clearForm,
  "ACTION_SAVE_FULFILLED": clearForm
}, initialState);

export default reducer;

