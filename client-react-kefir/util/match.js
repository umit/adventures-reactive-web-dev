module.exports = function(selector) {
  return function(evt) {
    return evt.target.matches(selector);
  };
};
