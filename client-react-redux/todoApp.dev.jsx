import React from "react";
import createStore from "./store.dev";
import todoApp from "./todoApp.jsx";

import {createDevTools} from "redux-devtools";
import LogMonitor from "redux-devtools-log-monitor";
import DockMonitor from "redux-devtools-dock-monitor";

export default function(element) {
  const DevTools = createDevTools(
    <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
      <LogMonitor theme="tomorrow"/>
    </DockMonitor>
  );

  todoApp(element, createStore, DevTools);
};
