"use strict";
/**
 * (Handler for all) ExpressionStatement
 *
 * This hook does not extract any entity/relation,
 * but only convert AST to token stream (IR) for later use.
 *
 * Extracted entities:
 *   * N/A
 *
 * Extracted relations:
 *   * N/A
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = resolve;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var literal_handler_1 = require("./literal-handler");
function resolve(node, scope, handlers) {
    try {
        var tokens = recursiveTraverse(node, scope, handlers);
        if (tokens.length === 0) {
            return undefined;
        }
        // The resolve of token stream is postponed to the linker.
        var task = {
            type: 'descend',
            payload: tokens,
            scope: scope.last(),
            onFinish: handlers === null || handlers === void 0 ? void 0 : handlers.onFinish,
            onFinishEntity: handlers === null || handlers === void 0 ? void 0 : handlers.onFinishEntity,
        };
        data_1.postponedTask.add(task);
        return task;
    }
    catch (e) {
        // Failed to create IR
    }
}
/**
 * Traverse the AST node recursively, generate a token stream, but not create
 * corresponding postponedTask, just return it for callee to merge.
 */
function recursiveTraverse(node, scope, handlers) {
    var tokenStream = [];
    // TODO: Handle points-to propagation by try-catch
    switch (node.type) {
        case 'AssignmentExpression': {
            var leftTask_1 = resolve(node.left, scope, handlers);
            if (['FunctionExpression', 'ArrowFunctionExpression', 'ClassExpression'].includes(node.right.type)) {
                // This should give us a receipt for the literal, which will be used for retrieve the entity
                var objRepr_1 = (0, literal_handler_1.default)(node.right);
                if (objRepr_1 !== undefined) {
                    var assignmentTarget_1 = leftTask_1.payload.shift();
                    if (leftTask_1) {
                        leftTask_1.onFinish = function (symbolSnapshot) {
                            data_1.postponedTask.add({
                                type: 'descend',
                                payload: [
                                    {
                                        operation: 'assign',
                                        operand0: assignmentTarget_1,
                                        operand1: [objRepr_1],
                                    },
                                    {
                                        operation: 'access',
                                        operand0: symbolSnapshot,
                                    }
                                ],
                                scope: scope.last(),
                                onFinish: undefined,
                            });
                            return true;
                        };
                    }
                }
            }
            else {
                var rightTask = resolve(node.right, scope, handlers);
                /**
                 * Pick the last token of the left task and form a new task for the assignment
                 * operation, so that linker knows to create a new property if the expression tries
                 * to assign to a non-existing property.
                 */
                var assignmentTarget_2 = leftTask_1 === null || leftTask_1 === void 0 ? void 0 : leftTask_1.payload.shift();
                if (rightTask && assignmentTarget_2) {
                    rightTask.onFinish = function (symbolSnapshotRight) {
                        leftTask_1.onFinish = function (symbolSnapshotLeft) {
                            data_1.postponedTask.add({
                                type: 'descend',
                                payload: [
                                    {
                                        operation: 'assign',
                                        operand0: assignmentTarget_2,
                                        operand1: symbolSnapshotRight,
                                    },
                                    {
                                        operation: 'access',
                                        operand0: symbolSnapshotLeft,
                                    }
                                ],
                                scope: scope.last(),
                                onFinish: undefined,
                            });
                            return true;
                        };
                        return true;
                    };
                }
            }
            break;
        }
        case 'OptionalCallExpression':
        case 'NewExpression':
        case 'CallExpression': {
            var operation = 'call';
            if (node.type === 'NewExpression') {
                operation = 'new';
            }
            // @ts-ignore TODO: callee can be V8IntrinsicIdentifier
            var calleeTokens = recursiveTraverse(node.callee, scope, handlers);
            /**
             * Resolve arguments of the call expression.
             * The shape of argsRepr is still a JSObjRepr (for uniformed handling).
             */
            var argsRepr_1 = (0, literal_handler_1.createJSObjRepr)('array');
            var _loop_1 = function (index, arg) {
                // @ts-ignore
                var objRepr = (0, literal_handler_1.default)(arg);
                if (objRepr !== undefined) {
                    argsRepr_1.kv[index] = objRepr;
                    return "continue";
                }
                var argTask = resolve(arg, scope);
                if (argTask) {
                    argTask.onFinish = function (symbolSnapshot) {
                        argsRepr_1.kv[index] = symbolSnapshot;
                        return true;
                    };
                }
            };
            for (var _i = 0, _a = Object.entries(node.arguments); _i < _a.length; _i++) {
                var _b = _a[_i], index = _b[0], arg = _b[1];
                _loop_1(index, arg);
            }
            tokenStream.push.apply(tokenStream, __spreadArray([{
                    operation: operation,
                    operand1: argsRepr_1,
                    location: (0, location_1.toENRELocation)(node.callee.loc, location_1.ToENRELocationPolicy.PartialEnd),
                }], calleeTokens, false));
            break;
        }
        case 'OptionalMemberExpression':
        case 'MemberExpression': {
            var objectTokens_1 = recursiveTraverse(node.object, scope, handlers);
            var prop = node.property;
            var propName = undefined;
            if (prop.type === 'Identifier') {
                propName = prop.name;
            }
            else if (prop.type === 'StringLiteral') {
                propName = prop.value;
            }
            else if (prop.type === 'NumericLiteral') {
                propName = prop.value.toString();
            }
            else if (prop.type === 'MemberExpression') {
                // Detect `Symbol.iterator` and `Symbol.asyncIterator`
                // In this hard-coded case, using a variable that points to `Symbol` is not supported.
                if (prop.object.type === 'Identifier'
                    && prop.object.name === 'Symbol'
                    && prop.property.type === 'Identifier'
                    && ['iterator', 'asyncIterator'].includes(prop.property.name)) {
                    if (prop.property.name === 'iterator') {
                        propName = Symbol.iterator;
                    }
                    else if (prop.property.name === 'asyncIterator') {
                        propName = Symbol.asyncIterator;
                    }
                }
            }
            if (propName) {
                tokenStream.push.apply(tokenStream, __spreadArray([{
                        operation: 'access',
                        operand1: propName,
                        location: (0, location_1.toENRELocation)(node.property.loc)
                    }], objectTokens_1, false));
            }
            else {
                var propTask = resolve(node.property, scope, undefined);
                if (propTask) {
                    propTask.onFinish = function (symbolSnapshot) {
                        symbolSnapshot.forEach(function (s) {
                            data_1.postponedTask.add({
                                type: 'descend',
                                payload: __spreadArray([
                                    {
                                        operation: 'access',
                                        operand1: s,
                                        location: (0, location_1.toENRELocation)(node.property.loc),
                                    }
                                ], objectTokens_1, true),
                                scope: scope.last(),
                                onFinish: undefined,
                            });
                        });
                        return true;
                    };
                }
            }
            break;
        }
        case 'Identifier': {
            tokenStream.push({
                operation: 'access',
                operand1: node.name,
                location: (0, location_1.toENRELocation)(node.loc)
            });
            break;
        }
        case 'ThisExpression': {
            tokenStream.push({
                operation: 'access',
                operand1: 'this',
                location: (0, location_1.toENRELocation)(node.loc),
            });
            break;
        }
        case 'Super': {
            tokenStream.push({
                operation: 'access',
                operand1: 'super',
                location: (0, location_1.toENRELocation)(node.loc)
            });
            break;
        }
        case 'NumericLiteral': {
            tokenStream.push({
                operation: 'access',
                operand1: node.value.toString(),
                location: (0, location_1.toENRELocation)(node.loc),
            });
            break;
        }
        case 'StringLiteral': {
            tokenStream.push({
                operation: 'access',
                operand1: node.value,
                location: (0, location_1.toENRELocation)(node.loc),
            });
            break;
        }
    }
    return tokenStream;
}
