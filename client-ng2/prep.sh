#!/bin/bash
if [ ! -d ../public/node_modules ]
  then
    mkdir -p ../public/node_modules/{{angular2,rxjs}/bundles,es6-shim,systemjs/dist} && \
      cp -v node_modules/angular2/bundles/angular2{-polyfills,.min}.js ../public/node_modules/angular2/bundles/ && \
      cp -v {,../public/}node_modules/es6-shim/es6-shim.min.js && \
      cp -v {,../public/}node_modules/rxjs/bundles/Rx.js && \
      cp -v {,../public/}node_modules/systemjs/dist/system.js 
  fi
