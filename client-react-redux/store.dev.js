import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import promiseMiddleware from "redux-promise-middleware";

export default function(todoListReducer, todoFormReducer, DevTools) {
  const reducer = combineReducers({list: todoListReducer, form: todoFormReducer});

  const createStoreWithMiddleware = compose(
    applyMiddleware(promiseMiddleware()),
    DevTools.instrument()
  )(createStore);

  const store = createStoreWithMiddleware(reducer);

  return store;
};
