"use strict";
/**
 * VariableDeclaration
 *
 * Extracted entities:
 *   * Variable
 *
 * Extracted relations:
 *   * Set @init=true
 */
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var binding_pattern_handler_1 = require("./common/binding-pattern-handler");
var naming_1 = require("@enre-ts/naming");
var literal_handler_1 = require("./common/literal-handler");
var expression_handler_1 = require("./common/expression-handler");
var buildOnRecord = function (kind, hasInit) {
    return function (name, location, scope) {
        var entity = (0, data_1.recordEntityVariable)(new naming_1["default"]('Norm', name), location, scope.last(), { kind: kind });
        scope.last().children.push(entity);
        if (hasInit) {
            // Record relation `set`
            (0, data_1.recordRelationSet)(scope.last(), entity, location, { isInit: true });
        }
        return entity;
    };
};
exports["default"] = {
    enter: function (path, _a) {
        var scope = _a.scope, modifiers = _a.modifiers;
        var kind = path.node.kind;
        var _loop_1 = function (declarator) {
            var objRepr = (0, literal_handler_1["default"])(declarator.init);
            // The init value is not a literal, but an expression.
            if (declarator.init && !objRepr) {
                objRepr = (0, expression_handler_1["default"])(declarator.init, scope);
            }
            // ForStatement is not supported due to the complexity of the AST structure.
            if (['ForOfStatement', 'ForInStatement'].includes(path.parent.type)) {
                objRepr = (0, literal_handler_1["default"])(path.parent.right);
            }
            var returned = (0, binding_pattern_handler_1["default"])(declarator.id, scope, undefined, buildOnRecord(kind, !!objRepr));
            if (returned && objRepr) {
                var variant_1 = undefined;
                if (path.parent.type === 'ForOfStatement') {
                    variant_1 = 'for-of';
                    if (path.parent.await) {
                        variant_1 = 'for-await-of';
                    }
                }
                else if (path.parent.type === 'ForInStatement') {
                    variant_1 = 'for-in';
                }
                if (objRepr.type === 'descend') {
                    objRepr.onFinish = function (resolvedResult) {
                        if (resolvedResult.length >= 1) {
                            data_1.postponedTask.add({
                                type: 'ascend',
                                payload: [{
                                        operation: 'assign',
                                        operand0: returned,
                                        // FIXME: Temporary only pass one resolved element, but it should be an array.
                                        operand1: resolvedResult[0],
                                        variant: variant_1
                                    }]
                            });
                            return true;
                        }
                        else {
                            return false;
                        }
                    };
                }
                else {
                    data_1.postponedTask.add({
                        type: 'ascend',
                        payload: [{
                                operation: 'assign',
                                operand0: returned,
                                operand1: objRepr,
                                variant: variant_1
                            }],
                        scope: scope.last()
                    });
                }
            }
        };
        for (var _i = 0, _b = path.node.declarations; _i < _b.length; _i++) {
            var declarator = _b[_i];
            _loop_1(declarator);
        }
    },
    exit: function (path, _a) {
        var modifiers = _a.modifiers;
        // if (path.node.declarator.id.type === 'Identifier') {
        //   if (declarator.init?.type === 'ObjectExpression') {
        //   }
        // }
        // const key = `${path.node.loc!.start.line}:${path.node.loc!.start.column}`;
        // modifiers.delete(key);
    }
};
