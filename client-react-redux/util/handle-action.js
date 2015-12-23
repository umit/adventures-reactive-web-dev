export default function(model, action, handlers) {
  if (action) {
    let result = model;

    for (var i = 0, t = handlers.length; i < t; i++) {
      let handler = handlers[i];

      if (handler.test(model, action)) {
        result = handler.handle(model, action);
        break;
      }
    }

    return result;
  }
  return model;
};
