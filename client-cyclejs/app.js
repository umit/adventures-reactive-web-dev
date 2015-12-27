import Cycle from "@cycle/core";
import {makeDOMDriver} from "@cycle/dom";
import {makeHTTPDriver} from "@cycle/http";
import main from "./main";

let makePreventDefaultDriver = function() {
  return function(preventDefault$) {
    preventDefault$.subscribe(function(evt) {
      evt.preventDefault();
    });
  };
};

let drivers = {
  DOM: makeDOMDriver("#app"),
  HTTP: makeHTTPDriver(),
  preventDefault: makePreventDefaultDriver()
};

Cycle.run(main, drivers);
