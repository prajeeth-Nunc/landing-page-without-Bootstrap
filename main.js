// most useful and no dependency functions

const debounce = (func, wait) => {
  let timeout;
  // This is the function that is returned and will be executed many times
  // We spread (...args) to capture any number of parameters we want to pass
  return function executedFunction(...args) {
    // The callback function to be executed after
    // the debounce time has elapsed
    const later = () => {
      // null timeout to indicate the debounce ended
      timeout = null;
      // Execute the callback
      func(...args);
    };
    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the
    // inside of the previous setTimeout
    clearTimeout(timeout);
    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs Node)
    timeout = setTimeout(later, wait);
  };
};

const store = {
  setItem: (k, v) => {
    localStorage.setItem(k, v);
  },
  getItem: (k) => {
    return localStorage.getItem(k);
  },
};

function createElement(element, attr = {}, styles = {}) {
  let tag = document.createElement(element);
  if (Object.keys(attr).length !== 0) {
    setAttributes(tag, attr);
  }
  if (Object.keys(styles).length !== 0) {
    setStyles(tag, styles);
  }
  return tag;
}

function setAttributes(tag, attrbs) {
  for (let prop in attrbs) {
    tag.setAttribute(prop, attrbs[prop]);
  }
}

function setStyles(tag, styles) {
  let text = "";
  for (let style in styles) {
    text += `${style}: ${styles[style]};`;
  }
  tag.style.cssText = text;
}