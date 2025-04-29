"use strict";
/**
 * ArrowFunctionDeclaration
 *
 * Extracted entities:
 *   * Function
 *     + (Only) Arrow Function
 *   * Parameter
 */
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
var parameter_handler_1 = require("./common/parameter-handler");
var literal_handler_1 = require("./common/literal-handler");
exports.default = {
    enter: function (path, _a) {
        var logs = _a.file.logs, scope = _a.scope;
        var entity = (0, data_1.recordEntityFunction)(new naming_1.default('Anon', 'ArrowFunction'), (0, location_1.toENRELocation)(path.node.loc), scope.last(), {
            isArrowFunction: true,
            isAsync: path.node.async,
            isGenerator: path.node.generator,
        });
        var objRepr = (0, literal_handler_1.createJSObjRepr)('obj');
        objRepr.callable.push({ entity: entity, returns: [] });
        entity.pointsTo.push(objRepr);
        scope.last().children.push(entity);
        scope.push(entity);
        data_1.sGraph.add(entity);
        (0, parameter_handler_1.default)(path.node, scope, logs);
    },
    exit: function (path, _a) {
        var scope = _a.scope;
        scope.pop();
    }
};
