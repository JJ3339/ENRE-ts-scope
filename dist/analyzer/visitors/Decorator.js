"use strict";
/**
 * Decorator
 *
 * Extracted entities:
 *   * N/A
 *
 * Extracted relations:
 *   * decorate
 */
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
exports["default"] = (function (path, _a) {
    var scope = _a.scope;
    var expressionType = path.node.expression.type;
    if (expressionType === 'Identifier') {
        data_1.pseudoR.add({
            from: { role: 'value', identifier: path.node.expression.name, at: scope.last() },
            to: data_1.eGraph.lastAdded,
            type: 'decorate',
            location: (0, location_1.toENRELocation)(path.node.expression.loc)
        });
    }
});
