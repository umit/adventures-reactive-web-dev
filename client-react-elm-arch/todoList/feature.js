import { Nothing } from "data.maybe";

import { createFeature } from "../library/feature";
import { initialModel } from "./model";
import services from "./service";
import { update } from "./update";
import { view } from "./view.jsx";

const createTodoListFeature = config => {
  const featureConfig = {
    inputs: config.inputs,
    initialModel: { model: initialModel, task: Nothing() },
    update: update(services),
    view: view
  };

  return createFeature(featureConfig);
};

export {
  createTodoListFeature
};
