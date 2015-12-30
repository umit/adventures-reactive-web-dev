import {handleActions} from "redux-actions";

const initialState = {inProgress: false, list: []};

const pending = () => ({inProgress: true, list: []});
const fulfilled = (model, action) => ({inProgress: false, list: action.payload});

const reducer = handleActions({
  "ACTION_LIST_PENDING": pending,
  "ACTION_SAVE_PENDING": pending,
  "ACTION_DELETE_PENDING": pending,
  "ACTION_LIST_FULFILLED": fulfilled,
  "ACTION_SAVE_FULFILLED": fulfilled,
  "ACTION_DELETE_FULFILLED": fulfilled
}, initialState);

export default reducer;

