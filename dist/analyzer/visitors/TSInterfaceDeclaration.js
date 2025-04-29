"use strict";
/**
 * TSInterfaceDeclaration
 *
 * Extracted entities:
 *   * Interface
 *
 * Extracted relations:
 *   * Extend
 */
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
exports["default"] = {
    enter: function (path, _a) {
        var scope = _a.scope;
        /**
         * Validate if there is already an interface entity with the same name first.
         * This is to support declaration merging.
         */
        var entity;
        for (var _i = 0, _b = scope.last().children; _i < _b.length; _i++) {
            var sibling = _b[_i];
            if (sibling.type === 'interface' && sibling.name.string === path.node.id.name) {
                entity = sibling;
                // entity!.declarations.push(toENRELocation(path.node.id.loc));
                break;
            }
        }
        if (!entity) {
            entity = (0, data_1.recordEntityInterface)(new naming_1["default"]('Norm', path.node.id.name), (0, location_1.toENRELocation)(path.node.id.loc), scope[scope.length - 1]);
            scope.last().children.push(entity);
        }
        for (var _c = 0, _d = path.node["extends"] || []; _c < _d.length; _c++) {
            var ex = _d[_c];
            if (ex.expression.type === 'Identifier') {
                data_1.pseudoR.add({
                    type: 'extend',
                    from: entity,
                    to: { role: 'type', identifier: ex.expression.name, at: scope.last() },
                    location: (0, location_1.toENRELocation)(ex.expression.loc)
                });
            }
        }
        scope.push(entity);
    },
    exit: function (path, _a) {
        var scope = _a.scope;
        scope.pop();
    }
};
