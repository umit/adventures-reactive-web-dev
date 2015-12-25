import React from "react-dom";
import {keys, reduce} from "ramda";
import serialize from "form-serialize";

const DOM = React.DOM;

export default function(props) {
  const getTodo = function(evt) {
    return serialize(evt.target.form, {hash: true});
  };

  const onChangeText = function(validationErrors) {
    return function(evt) {
      props.dispatch(props.actions.inFormAction(getTodo(evt)));
    };
  };

  const onSave = function(evt) {
    evt.preventDefault();
    props.dispatch(props.actions.saveAction(getTodo(evt)));
  };

  const onCancel = function(evt) {
    evt.preventDefault();
    props.dispatch(props.actions.cancelAction())
  };

  const todo = props.todo;
  const validationErrors = props.todo.validationErrors || {};
  const classNames = reduce(function(acc, key) {
      acc[key] = "form-group has-error";
      return acc;
    }, {}, keys(validationErrors));

  return DOM.div({className:"row"}, [
    DOM.div({className:"col-md-4"}, [
      DOM.form([
        DOM.input({type:"hidden", name:"id", value:todo.id}),
        DOM.div({className:(classNames.priority || "form-group")}, [
          DOM.label({htmlFor:"priority"}, "Priority:"),
          DOM.input({type:"text", id:"priority", name:"priority", className:"form-control", value:todo.priority, onChange:onChangeText(validationErrors)}),
          DOM.span({className:"help-block"}, validationErrors.priority)]),
        DOM.div({className:(classNames.description || "form-group")}, [
          DOM.label({htmlFor:"description"}, "Description:"),
          DOM.input({type:"text", id:"description", name:"description", className:"form-control", value:todo.description, onChange:onChangeText(validationErrors)}),
          DOM.span({className:"help-block"}, validationErrors.description)]),
        DOM.div([
          DOM.button({className:"btn btn-primary btn-xs", onClick:onSave, "data-action":"save"}, "Save"),
          DOM.span(" "),
          DOM.button({className:"btn btn-default btn-xs", onClick:onCancel, "data-action":"cancel"}, "Cancel")])])])]);
};
