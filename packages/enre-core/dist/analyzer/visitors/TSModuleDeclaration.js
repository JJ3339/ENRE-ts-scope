"use strict";
/**
 * TSModuleDeclaration
 *
 * Extracted entities:
 *   * Namespace
 *
 * Extracted relations:
 *   N/A
 */
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
exports.default = {
    enter: function (path, _a) {
        var scope = _a.scope;
        /**
         * Validate if there is already a namespace entity with the same name first.
         * This is to support declaration merging.
         */
        var entity;
        for (var _i = 0, _b = scope.last().children; _i < _b.length; _i++) {
            var sibling = _b[_i];
            // TODO: Class, function, and enum can also be merged with a namespace, when this happens, the invoke order is important.
            // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-namespaces-with-classes-functions-and-enums
            if (sibling.type === 'namespace' && sibling.name.codeName === (path.node.id.type === 'StringLiteral' ? path.node.id.value : path.node.id.name)) {
                entity = sibling;
                // entity!.declarations.push(toENRELocation(path.node.id.loc));
                break;
            }
        }
        if (!entity) {
            if (path.node.id.type === 'StringLiteral') {
                entity = (0, data_1.recordEntityNamespace)(new naming_1.default('Str', path.node.id.value), (0, location_1.toENRELocation)(path.node.id.loc), scope[scope.length - 1]);
            }
            else {
                entity = (0, data_1.recordEntityNamespace)(new naming_1.default('Norm', path.node.id.name), (0, location_1.toENRELocation)(path.node.id.loc), scope[scope.length - 1]);
            }
            scope.last().children.push(entity);
        }
        scope.push(entity);
    },
    exit: function (path, _a) {
        var scope = _a.scope;
        scope.pop();
    }
};
