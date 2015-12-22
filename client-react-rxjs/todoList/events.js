import Rx from "rx";

export default function() {
  return {
    deleteTodo$: new Rx.Subject(),
    editTodo$: new Rx.Subject()
  };
};
