"use strict";
/**
 * ReturnStatement|YieldStatement
 */
exports.__esModule = true;
var expression_handler_1 = require("./common/expression-handler");
exports["default"] = (function (path, _a) {
    var logs = _a.file.logs, scope = _a.scope;
    var callableEntity = scope.last();
    if (callableEntity.type !== 'function') {
        return;
    }
    if (!path.node.argument) {
        return;
    }
    var task = (0, expression_handler_1["default"])(path.node.argument, scope);
    if (task) {
        task.onFinish = function (symbolSnapshot) {
            var _a;
            /**
             * The return statement is strictly bind to its declaration function body,
             * thus will always be the first callable of the first pointsTo item
             * in the callable array.
             */
            (_a = callableEntity.pointsTo[0].callable[0].returns).push.apply(_a, symbolSnapshot);
            return true;
        };
    }
});
