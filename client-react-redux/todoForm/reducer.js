import {handleActions} from "redux-actions";

const initialState = {todo: {}};
const returnTodo = (model, action) => ({todo: action.payload});
const returnBlank = () => ({todo: {}});

const returnTodoWithPreviousValidation = (model, action) =>
  ({todo: action.payload.todo, validationErrors: model.validationErrors});

const returnTodoWithNewValidation = (model, action) =>
  ({todo: model.todo, validationErrors: action.payload.validationErrors});

export default handleActions({
  "ACTION_EDIT": returnTodo,
  "ACTION_IN_FORM_EDIT": returnTodoWithPreviousValidation,
  "ACTION_SAVE": returnTodoWithNewValidation,
  "ACTION_SAVE_FULFILLED": returnBlank,
  "ACTION_CANCEL": returnBlank
}, initialState);

