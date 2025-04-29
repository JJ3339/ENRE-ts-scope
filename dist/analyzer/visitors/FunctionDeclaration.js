"use strict";
/**
 * FunctionDeclaration|FunctionExpression
 *
 * Extracted entities:
 *   * Function
 *     - (Exclude) Arrow Function
 *   * Parameter
 */
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
var literal_handler_1 = require("./common/literal-handler");
var parameter_handler_1 = require("./common/parameter-handler");
exports["default"] = {
    enter: function (path, _a) {
        var logs = _a.file.logs, scope = _a.scope;
        var entity;
        if (path.node.id) {
            entity = (0, data_1.recordEntityFunction)(new naming_1["default"]('Norm', path.node.id.name), 
            /**
             * If it's a named function, use identifier's location as entity location.
             */
            (0, location_1.toENRELocation)(path.node.id.loc), scope.last(), {
                isArrowFunction: false,
                isAsync: path.node.async,
                isGenerator: path.node.generator
            });
        }
        else {
            entity = (0, data_1.recordEntityFunction)(new naming_1["default"]('Anon', 'Function'), 
            /**
             * If it's an unnamed function,
             * use the start position of this function declaration block
             * as the start position of this entity, and set length to 0.
             *
             * This will also count in `async`.
             */
            (0, location_1.toENRELocation)(path.node.loc), scope.last(), {
                isArrowFunction: false,
                isAsync: path.node.async,
                isGenerator: path.node.generator
            });
        }
        var objRepr = (0, literal_handler_1.createJSObjRepr)('obj');
        objRepr.callable.push({ entity: entity, returns: [] });
        entity.pointsTo.push(objRepr);
        scope.last().children.push(entity);
        scope.push(entity);
        data_1.sGraph.add(entity);
        (0, parameter_handler_1["default"])(path.node, scope, logs);
    },
    exit: function (path, _a) {
        var scope = _a.scope;
        scope.pop();
    }
};
