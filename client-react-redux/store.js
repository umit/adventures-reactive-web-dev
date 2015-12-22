import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import promiseMiddleware from "redux-promise-middleware";

export default function(todoListModel, todoFormModel, DevTools) {
  const model = combineReducers({todos: todoListModel, todo:todoFormModel});
  //const store = applyMiddleware(promiseMiddleware())(createStore)(model);

  const store = compose(
    applyMiddleware(promiseMiddleware()),
    DevTools.instrument()
  )(createStore)(model);

  return store;
};
