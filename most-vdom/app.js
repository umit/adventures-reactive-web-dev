import most from "most";
import {diff, h, patch} from "virtual-dom";
import createElement from "virtual-dom/create-element";

const match = function(query) {
  return function(evt) {
    return evt.target.matches(query);
  };
};

const render = function(element, vtree$) {
  vtree$
    .scan(function(tree, newTree) {
      return tree ? diff(tree, newTree) : newTree;
    })
    .scan((function(container) {
      return function(rootNode, nextDiff) {
        if (rootNode) {
          rootNode = patch(rootNode, nextDiff);
        }
        else if (nextDiff) {
          rootNode = createElement(nextDiff);
          container.appendChild(rootNode);
        }
        return rootNode;
      };
    })(element))
    .drain();
};

const view = function(count)  {
  return h("div", [
    h("div", "Count: " + String(count)),
    h("button.myButton", "Click me")]);
};

const appNode = document.getElementById("app");

const add$ = most.fromEvent("click", appNode)
  .filter(match("button.myButton"))
  .map(function() { return 1; });

const model$ = add$
  .scan(function(count, inc) {
    return count + inc;
  }, 0)
  .startWith(0);

const view$ = model$.map(view);

render(appNode, view$);
