import {h, render} from "yolk";
import Rx from "rx";
import {merge} from "ramda";
import ajax from "./util/ajax-rx-dom";
import formModel from "./todoForm/model";
import listModel from "./todoList/model";
import formEvents from "./todoForm/events";
import listEvents from "./todoList/events";
import listView from "./todoList/component.jsx";
import formView from "./todoForm/component.jsx";
import todoSummary from "./todoSummary/component.jsx";

export default function(element) {
  const events$ = merge(formEvents(), listEvents());

  const formModel$ = formModel(events$);
  const listModel$ = listModel(ajax, events$, formModel$);

  const ListView = listView(events$);
  const FormView = formView(events$);

  render(<div>
    <FormView model={formModel$.formModel$}/>
    <ListView todos={listModel$}/>
  </div>, element);
};
