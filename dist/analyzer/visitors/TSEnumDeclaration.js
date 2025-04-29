"use strict";
/**
 * TSEnumDeclaration
 *
 * Extracted entities:
 *   * Enum
 */
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
exports["default"] = {
    enter: function (path, _a) {
        var scope = _a.scope;
        /**
         * Validate if there is already an enum entity with the same name first.
         * This is to support declaration merging.
         */
        var entity;
        for (var _i = 0, _b = scope.last().children; _i < _b.length; _i++) {
            var sibling = _b[_i];
            if (sibling.type === 'enum' && sibling.name.payload === path.node.id.name) {
                entity = sibling;
                // entity!.declarations.push(toENRELocation(path.node.id.loc));
                break;
            }
        }
        if (!entity) {
            entity = (0, data_1.recordEntityEnum)(new naming_1["default"]('Norm', path.node.id.name), (0, location_1.toENRELocation)(path.node.id.loc), scope[scope.length - 1], {
                isConst: path.node["const"]
            });
            scope.last().children.push(entity);
        }
        /**
         * No matter how this enum entity is created (either a new one or already existed one),
         * add it to the scope for enum member to be correctly chained.
         */
        scope.push(entity);
        data_1.sGraph.add(entity);
    },
    exit: function (path, _a) {
        var scope = _a.scope;
        scope.pop();
    }
};
