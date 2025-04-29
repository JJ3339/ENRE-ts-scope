"use strict";
/**
 * TSTypeAliasDeclaration
 *
 * Extracted entities:
 *   * Type Alias
 */
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
exports.default = {
    enter: function (path, _a) {
        var scope = _a.scope;
        var entity = (0, data_1.recordEntityTypeAlias)(new naming_1.default('Norm', path.node.id.name), (0, location_1.toENRELocation)(path.node.id.loc), scope.last());
        scope.last().children.push(entity);
        /**
         * Type alias can open a scope for its type parameters.
         */
        scope.push(entity);
    },
    exit: function (path, _a) {
        var scope = _a.scope;
        scope.pop();
    }
};
