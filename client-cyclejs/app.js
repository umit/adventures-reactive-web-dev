import {run} from "@cycle/core";
import {makeDOMDriver} from "@cycle/dom";
import {makeHTTPDriver} from "@cycle/http";
import main from "./main";

// var main = require("./main").default;

const makePreventDefaultDriver = function() {
  return function(preventDefault$) {
    return preventDefault$.subscribe(function(evt) {
      evt.preventDefault();
    });
  };
};

const drivers = {
  DOM: makeDOMDriver("#app"),
  HTTP: makeHTTPDriver(),
  preventDefault: makePreventDefaultDriver()
};

run(main, drivers);
// const {sinks, sources} = run(main, drivers);

/*
if (module.hot) {
  const restart = function(main, sources, drivers) {
    sources.dispose();

    run(main, drivers);

    setTimeout(() => {
      for (let driverName in drivers) {
        const driver = drivers[driverName];

        if (driver.replayHistory) {
          const history = sources[driverName].history();
          driver.replayHistory(history);
        }
      }
    }, 10);
  };

  module.hot.accept("./main", () => {
    main = require("./main").default;
    restart(main, sources, drivers);
  });
}
*/
