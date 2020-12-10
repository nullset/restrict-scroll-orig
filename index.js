const allowScrollingInside = {
  elements: [],
  selectors: [],
};

const events = ['scroll', 'wheel'];
const eventOptions = {
  capture: true,
  passive: false,
};

function groupItems(exceptions) {
  exceptions = Array.isArray(exceptions) ? exceptions : [exceptions];
  exceptions.forEach((exception) => {
    switch (typeof exception) {
      case 'string':
        allowScrollingInside['selectors'].push(exception.trim());
        break;
      default:
        if (item.nodeType === 1)
          allowScrollingInside['elements'].push(exception);
        break;
    }
  });
}

function removeItemFromGroup(exceptions) {
  exceptions = Array.isArray(exceptions) ? exceptions : [exceptions];
  exceptions.forEach((exception) => {
    let key;
    let idx;
    switch (typeof exception) {
      case 'string':
        key = 'selectors';
        idx = allowScrollingInside[key].indexOf(exception.trim());
        break;
      default:
        if (item.nodeType === 1) {
          key = 'elements';
          idx = allowScrollingInside[key].indexOf(exception.trim());
        }
        break;
    }
    if (key && idx > -1) {
      allowScrollingInside[key].splice(idx, 1);
    }
  });
}

function handler(e) {
  const inPath = e.composedPath().some((node) => {
    return (
      allowScrollingInside.elements.includes(node) ||
      node.matches(allowScrollingInside.selectors.join(','))
    );
  });

  if (!inPath) {
    e.preventDefault();
  }
}

function on() {
  events.forEach((event) => {
    window.addEventListener(event, handler, eventOptions);
  });
}

function off() {
  events.forEach((event) => {
    window.removeEventListener(event, handler, eventOptions);
  });
}

function clear() {
  Object.keys(allowScrollingInside).forEach((key) => {
    allowScrollingInside[key] = [];
  });
}

export default function restrictScroll(exceptions) {
  if (exceptions) {
    groupItems(exceptions);
    run();
  }

  return {
    prevent: function prevent(exceptions) {
      removeItemFromGroup(exceptions);
    },
    allow: function allow(exceptions) {
      groupItems(exceptions);
    },
    clear,
    on,
    off,
  };
}
