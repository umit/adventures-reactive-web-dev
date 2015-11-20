var React = require("react");
var R = require("ramda");

module.exports = function(todos) {
  var totalTodos = todos.length;
  var totalPriority = R.pipe(R.pluck("priority"), R.map(parseInt), R.sum);
  var averagePriority = totalPriority(todos) / totalTodos;

  return (
    <div>
      <span>Total todos: {totalTodos} Average priority: {averagePriority}</span>
    </div>
  );
};
