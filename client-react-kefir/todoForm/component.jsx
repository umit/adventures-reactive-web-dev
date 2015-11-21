var React = require("react");
var R = require("ramda");

module.exports = function(model, events$) {
  var todo = model.todo;
  var validationErrors = model.validationErrors || {};
  var classNames = R.reduce(function(acc, key) {
      acc[key] = "form-group has-error";
      return acc;
    }, {}, R.keys(validationErrors));

  return (
    <div className="row">
      <div className="col-md-4">
        <form>
          <input type="hidden" name="id" value={todo.id}/>
          <div className={(classNames.priority || "form-group")}>
            <label htmlFor="priority">Priority:</label>
            <input type="text" id="priority" name="priority" className="form-control"/>
            <span className="help-block">{validationErrors.priority}</span>
          </div>
          <div className={(classNames.description || "form-group")}>
            <label htmlFor="description">Description:</label>
            <input type="text" id="description" name="description" className="form-control"/>
            <span className="help-block">{validationErrors.description}</span>
          </div>
          <div>
            <button className="btn btn-primary btn-xs saveBtn">Save</button>
            <span> </span>
            <button className="btn btn-default btn-xs cancelBtn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

