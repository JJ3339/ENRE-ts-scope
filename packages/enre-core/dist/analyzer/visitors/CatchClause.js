"use strict";
/**
 * CatchClause
 *
 * Extracted entities:
 *   * Parameter
 */
Object.defineProperty(exports, "__esModule", { value: true });
var parameter_handler_1 = require("./common/parameter-handler");
exports.default = {
    enter: function (path, _a) {
        var logs = _a.file.logs, scope = _a.scope;
        (0, parameter_handler_1.default)(path.node, scope, logs);
    },
    exit: function (path, _a) {
        var scope = _a.scope;
        // scope.pop();
    }
};
