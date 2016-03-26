import {expect} from "chai";
import Maybe from "data.maybe";
import {identity, merge} from "ramda";

import {createFeature} from "../../library/feature";

describe("library/feature", function() {
  const baseConfig = {
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
  };

  it("should create a feature", function() {
    const feature = createFeature(baseConfig);

    expect(feature.view$).to.exist;
    expect(feature.task$).to.exist;
  });

  it("should call the view with an address and a model", function(done) {
    const initial = { duck: "quack" };

    const feature = createFeature(merge(baseConfig, {
      initialModel: {
        model: initial,
        task: Maybe.Nothing()
      },
      view: address => model => {
        expect(address).to.exist;
        expect(address.next).to.exist;
        expect(address.next).to.be.a("function");

        expect(model).to.equal(initial);

        done();
      }
    }));

    feature.view$.subscribe(identity);
  });
});
