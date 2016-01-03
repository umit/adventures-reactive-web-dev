import {h, render} from "yolk";
import Rx from "rx";
import {merge} from "ramda";
import ajax from "./util/ajax-rx-dom";
import formModel from "./todoForm/model";
import listModel from "./todoList/model";
import formEvents from "./todoForm/events";
import listEvents from "./todoList/events";
import ListView from "./todoList/component.jsx";
import FormView from "./todoForm/component.jsx";
import todoSummary from "./todoSummary/component.jsx";

export default function(element) {
  const events$ = merge(formEvents(), listEvents());

  const formModel$ = formModel(events$);
  const listModel$ = listModel(ajax, events$, formModel$);

  render(<div>
    <FormView model={formModel$} events={events$}/>
    <ListView todos={listModel$} events={events$}/>
  </div>, element);
};
