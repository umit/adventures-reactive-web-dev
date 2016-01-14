const handleActions = require("redux-actions").handleActions;

const initialState = {todo: {}};
const returnTodo = (model, action) => ({todo: action.payload});
const returnBlank = () => ({todo: {}});

const returnTodoWithNewValidation = (model, action) =>
  ({todo: model.todo, validationErrors: action.payload.validationErrors});

export default handleActions({
  "ACTION_EDIT": returnTodo,
  "ACTION_SAVE": returnTodoWithNewValidation,
  "ACTION_SAVE_FULFILLED": returnBlank,
  "ACTION_CANCEL": returnBlank
}, initialState);

