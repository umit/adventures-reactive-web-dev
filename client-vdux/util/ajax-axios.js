var axios = require("axios");
var R = require("ramda");

var ajaxPromise = function(options) {
  return axios(options).then(R.prop("data"));
};

module.exports = {
  getJSON: function(url) {
    return ajaxPromise({
      url: url
    });
  },

  postJSON: function(url, body) {
    return ajaxPromise({
      method: "POST",
      url: url,
      data: JSON.stringify(body)
    });
  },

  deleteJSON: function(url) {
    return ajaxPromise({
      method: "DELETE",
      url: url
    });
  }
};
