import React from "react";
import {keys, reduce} from "ramda";
import serialize from "form-serialize";

const view = actions => model => {
  const getTodo = function(evt) {
    return serialize(evt.target.form, {hash: true});
  };

  const onChangeText = function(validationErrors) {
    return function(evt) {
      events$.inFormEdit$.onNext({todo: getTodo(evt), validationErrors: validationErrors});
    };
  };

  const onSave = function(evt) {
    evt.preventDefault();
    events$.saveTodo$.onNext(getTodo(evt));
  };

  const onCancel = function(evt) {
    evt.preventDefault();
    events$.cancelTodo$.onNext();
  };

// FIXME
  const todo = model.todo || {};
  const validationErrors = model.validationErrors || {};
  const classNames = reduce(function(acc, key) {
      acc[key] = "form-group has-error";
      return acc;
    }, {}, keys(validationErrors));

  return (
    <div className="row">
      <div className="col-md-4">
        <form>
          <input type="hidden" name="id" value={todo.id}/>
          <div className={(classNames.priority || "form-group")}>
            <label htmlFor="priority">Priority:</label>
            <input type="text" id="priority" name="priority" className="form-control" value={todo.priority} onChange={onChangeText(validationErrors)}/>
            <span className="help-block">{validationErrors.priority}</span>
          </div>
          <div className={(classNames.description || "form-group")}>
            <label htmlFor="description">Description:</label>
            <input type="text" id="description" name="description" className="form-control" value={todo.description} onChange={onChangeText(validationErrors)}/>
            <span className="help-block">{validationErrors.description}</span>
          </div>
          <div>
            <button className="btn btn-primary btn-xs" onClick={onSave} data-action="save">Save</button>
            <span> </span>
            <button className="btn btn-danger btn-xs" onClick={onCancel} data-action="cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default view;

