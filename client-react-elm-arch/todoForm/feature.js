import { createFeature } from "../library/feature";
import { initialModel } from "./model";
import services from "./service";
import { update } from "./update";
import { view } from "./view.jsx";

const createTodoFormFeature = config => {
  const featureConfig = {
    inputs: config.inputs,
    initialModel: [initialModel, null],
    update: update(services),
    view: view
  };

  return createFeature(featureConfig);
};

export {
  createTodoFormFeature
};
