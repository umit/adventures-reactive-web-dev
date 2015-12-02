var Kefir = require("kefir");
var axios = require("axios");
var R = require("ramda");

var ajaxStream = function(options) {
  return Kefir.stream(function(emitter) {
    axios(options).then(R.prop("data")).then(emitter.emit).catch(function(response) {
      emitter.error(response.status === 0 ? "Connection problem" : response.responseText);
    });
  }).take(1).takeErrors(1);
};

module.exports = {
  getJSON: function(url) {
    return ajaxStream({
      url: url
    });
  },

  postJSON: function(url, body) {
    return ajaxStream({
      method: "POST",
      url: url,
      data: JSON.stringify(body)
    });
  },

  deleteJSON: function(url) {
    return ajaxStream({
      method: "DELETE",
      url: url
    });
  }
};
