import {expect} from "chai";
import Maybe from "data.maybe";
import Task from "data.task";
import {identity, merge} from "ramda";

import {createFeature} from "../../library/feature";

describe("library/feature", function() {
  const baseConfig = {
    inputs: [],
    initialModel: {
      model: {},
      task: Maybe.Nothing()
    },
    update: action => model => ({
      model: model,
      task: Maybe.Nothing()
    }),
    view: address => model => null
  };

  it("creates a feature", function() {
    const feature = createFeature(baseConfig);

    expect(feature.view$).to.exist;
    expect(feature.task$).to.exist;
  });

  it("calls the view with an address and a model", function(done) {
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

  it("calls update with an action and a model", function(done) {
    const initial = { duck: "quack" };
    const testAction = "TEST";
    let flag = true;

    const feature = createFeature(merge(baseConfig, {
      initialModel: {
        model: initial,
        task: Maybe.Nothing()
      },
      view: address => model => {
        if (flag) {
          flag = false;
          address.next(testAction);
        }
      },
      update: action => model => {
        expect(action).to.equal(testAction);
        expect(model).to.equal(initial);
        done();
        return {model, task: Maybe.Nothing()};
      }
    }));

    //feature.task$.subscribe(identity);
    feature.view$.subscribe(identity);
  });

  it("sends the next action", function(done) {
    const firstAction = "first";
    const secondAction = "second";
    const task = Task.of(secondAction);

    let flag = true;

    const feature = createFeature(merge(baseConfig, {
      view: address => model => {
        if (flag) {
          flag = false;
          address.next(firstAction);
          return "view 1";
        }
        return "view 2";
      },
      update: action => model => {
        if (action === firstAction) {
          return {model, task: Maybe.Just(task)};
        }
        else if (action === secondAction) {
          done();
          return {model, task: Maybe.Nothing()};
        }
      }
    }));

    feature.view$.subscribe(identity);
    feature.task$.subscribe(t => t.fork(identity, identity));
  });
});
