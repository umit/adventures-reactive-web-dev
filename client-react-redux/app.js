var todoApp = null;

if (process.env.DEV_ENV) {
  todoApp = require("./todoApp.dev");
}
else {
  todoApp = require("./todoApp.prod");
}

todoApp["default"](document.getElementById("app"));
