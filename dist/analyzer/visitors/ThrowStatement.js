"use strict";
/**
 * ThrowStatement
 */
exports.__esModule = true;
var expression_handler_1 = require("./common/expression-handler");
exports["default"] = (function (path, _a) {
    var logs = _a.file.logs, scope = _a.scope;
    if (!path.node.argument) {
        return;
    }
    (0, expression_handler_1["default"])(path.node.argument, scope);
});
