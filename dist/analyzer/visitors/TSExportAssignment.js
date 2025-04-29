"use strict";
/**
 * TSExportAssignment
 *
 * Extracted relations:
 *   * Export
 */
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
exports["default"] = (function (path, _a) {
    var scope = _a.scope;
    if (path.node.expression.type === 'Identifier') {
        data_1.pseudoR.add({
            type: 'export',
            from: scope.last(),
            to: {
                role: 'any',
                identifier: path.node.expression.name,
                at: scope.last()
            },
            location: (0, location_1.toENRELocation)(path.node.expression.loc),
            isDefault: false,
            isAll: false,
            kind: 'any'
        });
    }
});
