import React from "react";
import serialize from "form-serialize";
import {assoc, keys, reduce} from "ramda";

const View = function(props) {
  const getTodo = function(evt) {
    return {todo: serialize(evt.target.form, {hash:true})};
  };

  const onChangeText = function(evt) {
    props.dispatch(props.actions.inFormEdit(getTodo(evt)));
  };

  const onSave = function(evt) {
    evt.preventDefault();
    props.dispatch(props.actions.saveTodo(getTodo(evt)));
  };

  const onCancel = function(evt) {
    evt.preventDefault();
    props.dispatch(props.actions.cancelForm());
  };

  const todo = props.form.todo;
  const validationErrors = props.form.validationErrors || {};
  const classNames = reduce((acc, key) => assoc(key, "form-group has-error", acc), {}, keys(validationErrors));

  return (
    <div className="row">
      <div className="col-md-4">
        <form>
          <input type="hidden" name="id" value={todo.id}/>
          <div className={(classNames.priority || "form-group")}>
            <label htmlFor="priority">Priority:</label>
            <input type="text" id="priority" name="priority" className="form-control" value={todo.priority}
              onChange={onChangeText}/>
            <span className="help-block">{validationErrors.priority}</span>
          </div>
          <div className={(classNames.description || "form-group")}>
            <label htmlFor="description">Description:</label>
            <input type="text" id="description" name="description" className="form-control" value={todo.description}
              onChange={onChangeText}/>
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

export default View;
