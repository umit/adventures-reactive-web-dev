var todoApp = null;

if (process.env.DEV_ENV) {
  todoApp = require("./todoApp.dev.jsx");
}
else {
  todoApp = require("./todoApp.prod.jsx");
}

todoApp["default"](document.getElementById("app"));
