import {run} from "@cycle/core";
import {makeDOMDriver} from "@cycle/dom";
import {makeHTTPDriver} from "@cycle/http";
import main from "./main";

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

const {sinks, sources} = run(main, drivers);

if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    sinks.dispose();
    sources.dispose();
  });
}
