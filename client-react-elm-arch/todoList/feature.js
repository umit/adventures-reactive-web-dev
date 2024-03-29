import { createFeature } from "../library/feature";
import { initialModel } from "./model";
import { loadTodos, deleteTodo } from "./service";
import { broadcast } from "../library/broadcast";
import { update } from "./update";
import { view } from "./view.jsx";

const createTodoListFeature = config => {
  const services = {
    loadTodos,
    deleteTodo,
    signalEditTodo: broadcast(config.outputs.onEditTodo)
  };
  const featureConfig = {
    inputs: config.inputs,
    initialModel: [initialModel, null],
    update: update(services),
    view: view
  };

  return createFeature(featureConfig);
};

export {
  createTodoListFeature
};
