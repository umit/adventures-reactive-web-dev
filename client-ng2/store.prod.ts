const {applyMiddleware, combineReducers, createStore} = require("redux");
const promiseMiddleware = require("redux-promise-middleware");

export default function(todoListReducer, todoFormReducer) {
  const reducer = combineReducers({list: todoListReducer, form: todoFormReducer});
  const createStoreWithMiddleware = applyMiddleware(promiseMiddleware())(createStore);
  const store = createStoreWithMiddleware(reducer);

  return store;
};
