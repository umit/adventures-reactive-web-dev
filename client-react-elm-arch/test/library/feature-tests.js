import {expect} from "chai";
import Maybe from "data.maybe";

import {createFeature} from "../../library/feature";

describe("library/feature", function() {
  it("should create a feature", function() {
    const feature = createFeature({
      inputs: [],
      initialModel: {
        model: {},
        task: Maybe.Nothing()
      },
      update: (action, model) => ({
        model: model,
        task: Maybe.Nothing()
      }),
      view: address => model => null
    });

    expect(feature.view$).to.exist;
    expect(feature.task$).to.exist;
  });
});
