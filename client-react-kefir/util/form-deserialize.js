module.exports = function(form, data) {
  var elements = form.elements;
  Object.keys(data).forEach(function(key) {
    var element = elements[key];
    if (element) {
      element.value = data[key];
    }
  });
};
