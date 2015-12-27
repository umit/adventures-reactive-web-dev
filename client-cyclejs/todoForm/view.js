import {button, div, form, input, label, span} from "@cycle/dom";
import {keys, reduce} from "ramda";

let view = function(model) {
  let view$ = model.todoForm$.map(function(todoForm) {
    var todo = todoForm.todo;
    var validationErrors = todoForm.validationErrors || {};
    var classNames = reduce(function(acc, key) {
      acc[key] = "form-group.has-error";
      return acc;
    }, {}, keys(validationErrors));

    return div(".row",
      div(".col-md-4",
        form([
          input({type:"hidden", name:"id", value:todo.id}),
          div("." + (classNames.priority || "form-group"), [
            label({htmlFor:"priority"}, "Priority:"),
            input(".form-control", {type:"text", id:"priority", name:"priority", value:todo.priority}),
            span(".help-block", validationErrors.priority)
          ]),
          div("." + (classNames.description || "form-group"), [
            label({htmlFor:"description"}, "Description:"),
            input(".form-control", {type:"text", id:"description", name:"description", value:todo.description}),
            span(".help-block", validationErrors.description)
          ]),
          div([
            button(".btn.btn-primary.btn-xs.saveTodo", "Save"),
            span(" "),
            button(".btn.btn-danger.btn-xs.cancelTodo", "Cancel")
          ])
        ])
      )
    );
  });
 
  return {
    DOM: view$
  };
};

export default view;
