import intent from "./intent";
import model from "./model";
import view from "./view";

// import makeTimeTravel from "cycle-time-travel";
import {div} from "@cycle/dom";

let main = function(sources, editTodo$) {
  let intent$ = intent(sources.DOM);
  let model$ = model(sources.HTTP, intent$, editTodo$);

  /*
  const {DOM: timeTravelBar$, timeTravel} = makeTimeTravel(sources.DOM, [
    {stream: model$.todoForm$, label: "todoForm$"}
  ]);
  */

  let view$ = view(model$);
  // let view$ = view(timeTravel);

  /*
  let timeTravelView$ = view$.DOM.combineLatest(timeTravelBar$, (formView, timeTravelBar) =>
    div([formView, timeTravelBar]));
  */

  return {
    // DOM: timeTravelView$,
    DOM: view$.DOM,
    HTTP: model$.HTTP,
    preventDefault: intent$.preventDefault
  };
};

export default main;
