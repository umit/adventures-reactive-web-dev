import {h} from "yolk";
import {keys, prop, reduce} from "ramda";
import serialize from "form-serialize";

export default function(events) {
  return function({props, createEventHandler}) {
    const model$ = props.model;

    const getTodo = function(evt) {
      return serialize(evt.target.form, {hash: true});
    };

    const onChangeText = function(validationErrors) {
      return function(evt) {
        events.inFormEdit$.onNext({todo: getTodo(evt), validationErrors: validationErrors});
      };
    };

    const onSave = function(evt) {
      evt.preventDefault();
      events.saveTodo$.onNext(getTodo(evt));
    };

    const onCancel = function(evt) {
      evt.preventDefault();
      events.cancelTodo$.onNext();
    };

    const todo$ = model$.map(prop("todo"));
//const validationErrors = model$.validationErrors || {};
    const validationErrors = {};
    const classNames = reduce(function(acc, key) {
        acc[key] = "form-group has-error";
        return acc;
      }, {}, keys(validationErrors));

    return (
      <div className="row">
        <div className="col-md-4">
          <form>
            <input type="hidden" name="id" value={todo$.map(prop("id"))}/>
            <div className={(classNames.priority || "form-group")}>
              <label htmlFor="priority">Priority:</label>
              <input type="text" id="priority" name="priority" className="form-control" value={todo$.map(prop("priority"))}
                onChange={onChangeText(validationErrors)}/>
              <span className="help-block">{validationErrors.priority}</span>
            </div>
            <div className={(classNames.description || "form-group")}>
              <label htmlFor="description">Description:</label>
              <input type="text" id="description" name="description" className="form-control" value={todo$.map(prop("description"))}
                onChange={onChangeText(validationErrors)}/>
              <span className="help-block">{validationErrors.description}</span>
            </div>
            <div>
              <button className="btn btn-primary btn-xs" onClick={onSave}>Save</button>
              <span> </span>
              <button className="btn btn-default btn-xs" onClick={onCancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
};
