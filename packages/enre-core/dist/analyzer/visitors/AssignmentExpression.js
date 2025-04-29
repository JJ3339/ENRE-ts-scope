"use strict";
/**
 * AssignmentExpression
 *
 * Extracted entities:
 *   * N/A
 *
 * Extracted relations:
 *   * set
 *   * modify
 */
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
exports.default = (function (path, _a) {
    var scope = _a.scope;
    if (path.node.left.type === 'Identifier') {
        // Since '=' assignment is handled in the expression-handler.ts, is this a duplication?
        if (path.node.operator === '=') {
            data_1.pseudoR.add({
                type: 'set',
                from: scope.last(),
                to: { role: 'value', identifier: path.node.left.name, at: scope.last() },
                location: (0, location_1.toENRELocation)(path.node.left.loc),
                isInit: false,
            });
        }
        else {
            data_1.pseudoR.add({
                type: 'modify',
                from: scope.last(),
                to: { role: 'value', identifier: path.node.left.name, at: scope.last() },
                location: (0, location_1.toENRELocation)(path.node.left.loc),
            });
        }
    }
});
