var oldError = window.onerror;
window.onerror = function(msg, fileUrl, lineNo, columnNo, error) {
  var args = Array.prototype.slice.call(arguments);

  if (oldError) {
    oldError.apply(window, args);
  }
  var stack = null;
  if (error && error.stack) stack = error.stack;
  var json = {
    msg: msg || null,
    fileUrl: fileUrl || null,
    lineNo: lineNo || null,
    columnNo: columnNo || null,
    error: stack
  };
  console.log(json);
};
