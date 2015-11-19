var React = require("react");
var serialize = require("form-serialize");

module.exports = function(model, events$) {
  var getTodo = function(evt) {
    return serialize(evt.target.form, {hash: true});
  };

  var onChangeText = function(validationErrors) {
    return function(evt) {
      events$.inFormEdit$.onNext({todo: getTodo(evt), validationErrors: validationErrors});
    };
  };

  var onSave = function(evt) {
    evt.preventDefault();
    events$.saveTodo$.onNext(getTodo(evt));
  };

  var onCancel = function(evt) {
    evt.preventDefault();
    events$.cancelTodo$.onNext();
  };

  var todo = model.todo;
  var validationErrors = model.validationErrors || {};

  return (
    <form>
      <input type="hidden" name="id" value={todo.id}/>
      <div>Priority:</div>
      <div><input type="text" name="priority" size="2" value={todo.priority} onChange={onChangeText(validationErrors)}/></div>
      <span className="error">{validationErrors.priority}</span>
      <div>Description:</div>
      <div><input type="text" name="description" value={todo.description} onChange={onChangeText(validationErrors)}/></div>
      <span className="error">{validationErrors.description}</span>
      <div>
        <button className="btn btn-primary btn-xs" onClick={onSave} data-action="save">Save</button>
        <button className="btn btn-default btn-xs" onClick={onCancel} data-action="cancel">Cancel</button>
      </div>
    </form>
  );
};

