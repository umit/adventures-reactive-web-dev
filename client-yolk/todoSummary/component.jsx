import {h} from "yolk";
import {map, pipe, pluck, sum} from "ramda";

module.exports = function(todos) {
  const totalTodos = todos.length;
  const totalPriority = pipe(pluck("priority"), map(parseInt), sum);
  const averagePriority = totalPriority(todos) / totalTodos;

  return (
    <div>
      <span>Total todos: {totalTodos} Average priority: {averagePriority}</span>
    </div>
  );
};
