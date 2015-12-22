import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import promiseMiddleware from "redux-promise-middleware";

export default function(todoListModel, todoFormModel) {
  const model = combineReducers({todos: todoListModel, todo:todoFormModel});
  const store = applyMiddleware(promiseMiddleware())(createStore)(model);

  return store;
};
