import snabbdom from "snabbdom";

const patch = snabbdom.init([
  require('snabbdom/modules/props'),
  require('snabbdom/modules/eventlisteners')
]);

const h = require("snabbdom/h");

const appNode = document.getElementById("app");

