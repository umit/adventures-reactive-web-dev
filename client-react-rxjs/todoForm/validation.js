var validate = require("validate.js");

var validationSpec = {
  description: {
    presence: true,
    length: {
      maximum: 50
    }
  },
  priority: {
    presence: true,
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      lessThanOrEqualTo: 10
    }
  }
};

module.exports = function(model) {
  return validate(model, validationSpec);
};

