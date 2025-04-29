"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var data_2 = require("@enre-ts/data");
/**
 * These parent types:
 *   * Span a declaration scope
 *   * The scope is presented as a block node
 *   * The scope is handled in their dedicated visitors
 */
var ignoreParentTypes = [
    'ArrowFunctionExpression',
    'ClassMethod',
    'FunctionDeclaration',
    'FunctionExpression',
    'ForOfStatement',
    'ForInStatement',
];
/**
 * The creation of block scope for certain kinds of AST nodes
 * is handled in their dedicated visitors, hence we should record
 * whether the corresponding block entity was created or not (to
 * correctly handle enter/exit event).
 *
 * This memo table uses block's `${startLine}:${startColumn}` as unique
 * map key, and the value is a boolean indicating whether a block entity
 * was created for that code point, so that while exiting this block node,
 * we can decide whether to pop the block entity from the scope stack.
 *
 * This table enables sharing information between enter/exit events,
 * and can correctly handle block nesting.
 */
var memoTable = new Map();
exports.default = {
    enter: function (path, _a) {
        var logs = _a.file.logs, scope = _a.scope;
        var memoKey = "".concat(path.node.loc.start.line, ":").concat(path.node.loc.start.column);
        if (ignoreParentTypes.includes(path.parent.type)) {
            memoTable.set(memoKey, false);
        }
        else {
            memoTable.set(memoKey, true);
            var entity = (0, data_1.recordEntityBlock)('any', (0, location_1.toENRELocation)(path.node.loc), scope.last());
            scope.last().children.push(entity);
            scope.push(entity);
            data_2.sGraph.add(entity);
        }
    },
    exit: function (path, _a) {
        var scope = _a.scope;
        var memoKey = "".concat(path.node.loc.start.line, ":").concat(path.node.loc.start.column);
        if (memoTable.get(memoKey)) {
            scope.pop();
            memoTable.delete(memoKey);
        }
    },
};
