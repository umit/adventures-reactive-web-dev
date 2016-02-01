import createStore from "./store.prod";
import todoApp from "./todoApp.jsx";

export default function(element) {
  todoApp(element, createStore);
};
