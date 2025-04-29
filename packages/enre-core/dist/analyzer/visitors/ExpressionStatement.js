"use strict";
/**
 * ExpressionStatement
 *
 * This hook does not extract any entity/relation,
 * but only convert AST to token stream (IR) for later use.
 *
 * Extracted entities:
 *   * N/A
 *
 * Extracted relations:
 *   * N/A
 */
Object.defineProperty(exports, "__esModule", { value: true });
var expression_handler_1 = require("./common/expression-handler");
exports.default = (function (path, _a) {
    var scope = _a.scope;
    (0, expression_handler_1.default)(path.node.expression, scope);
});
