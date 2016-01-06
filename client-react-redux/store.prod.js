import {applyMiddleware, combineReducers, createStore} from "redux";
import promiseMiddleware from "redux-promise-middleware";

export default function(todoListReducer, todoFormReducer) {
  const reducer = combineReducers({list: todoListReducer, form: todoFormReducer});
  const createStoreWithMiddleware = applyMiddleware(promiseMiddleware())(createStore);
  const store = createStoreWithMiddleware(reducer);

  return store;
};
