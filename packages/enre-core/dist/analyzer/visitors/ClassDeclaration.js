"use strict";
/**
 * ClassDeclaration|ClassExpression
 *
 * Extracted entities:
 *   * Class
 *
 * Extracted relations:
 *   * Extend
 *   * Implement
 */
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
var expression_handler_1 = require("./common/expression-handler");
var literal_handler_1 = require("./common/literal-handler");
exports.default = {
    enter: function (path, _a) {
        var _b, _c;
        var scope = _a.scope;
        var entity;
        if (path.node.id) {
            entity = (0, data_1.recordEntityClass)(new naming_1.default('Norm', path.node.id.name), 
            /**
             * If it's a named class, use identifier's location as entity location.
             */
            (0, location_1.toENRELocation)(path.node.id.loc), scope.last(), {
                isAbstract: 'abstract' in path.node ? (_b = path.node.abstract) !== null && _b !== void 0 ? _b : false : false,
            });
        }
        else {
            entity = (0, data_1.recordEntityClass)(new naming_1.default('Anon', 'Class'), 
            /**
             * If it's an unnamed class,
             * use the start position of this class declaration block
             * as the start position of this entity, and set length to 0.
             */
            (0, location_1.toENRELocation)(path.node.loc), scope.last(), {
                isAbstract: 'abstract' in path.node ? (_c = path.node.abstract) !== null && _c !== void 0 ? _c : false : false,
            });
        }
        /**
         * The JSObjRepr of the class entity is created here.
         *
         * However, the `callable` of this JSObjRepr is set in the ClassMethod visitor
         * if a `constructor` presents, and if not, the `callable` will set to the class
         * entity in the exit hook of this visitor.
         */
        var objRepr = (0, literal_handler_1.createJSObjRepr)('obj');
        entity.pointsTo.push(objRepr);
        scope.last().children.push(entity);
        scope.push(entity);
        data_1.sGraph.add(entity);
        if (path.node.superClass) {
            (0, expression_handler_1.default)(path.node.superClass, scope, {
                onFinishEntity: function (parentClasses) {
                    if (parentClasses.length >= 0) {
                        (0, data_1.recordRelationExtend)(entity, parentClasses[0], (0, location_1.toENRELocation)(path.node.superClass.loc));
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            });
        }
        for (var _i = 0, _d = path.node.implements || []; _i < _d.length; _i++) {
            var im = _d[_i];
            if (im.type === 'TSExpressionWithTypeArguments') {
                if (im.expression.type === 'Identifier') {
                    data_1.pseudoR.add({
                        type: 'implement',
                        from: entity,
                        to: { role: 'type', identifier: im.expression.name, at: scope.last() },
                        location: (0, location_1.toENRELocation)(im.expression.loc),
                    });
                }
            }
        }
    },
    exit: function (path, _a) {
        var scope = _a.scope;
        var classEntity = scope.last();
        if (classEntity.pointsTo[0].callable.length === 0) {
            classEntity.pointsTo[0].callable.push({
                entity: classEntity,
                /**
                 * Temporary assign the return value of a new call to a class to be itself.
                 * TODO: Truly resolve the return value of a new call to a class with the respect
                 * of constructor's return value.
                 */
                returns: [classEntity],
            });
        }
        scope.pop();
    }
};
