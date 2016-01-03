import Rx from "rx";

export default function() {
  return {
    saveTodo$: new Rx.Subject(),
    inFormEdit$: new Rx.Subject(),
    cancelTodo$: new Rx.Subject()
  };
};
