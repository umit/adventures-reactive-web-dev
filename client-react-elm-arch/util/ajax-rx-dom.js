import Rx from "rx-dom";

const ajax = {
  getJSON: Rx.DOM.getJSON,

  postJSON: function(url, body) {
    return Rx.DOM.ajax({
      method: "POST",
      url: url,
      body: JSON.stringify(body),
      responseType: "json"
    })
    .pluck("response");
  },

  deleteJSON: function(url) {
    return Rx.DOM.ajax({
      method: "DELETE",
      url: url,
      responseType: "json"
    })
    .pluck("response");
  }
};

export default ajax;
