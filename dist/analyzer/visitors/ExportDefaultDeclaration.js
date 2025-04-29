"use strict";
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var modifier_1 = require("../context/modifier");
exports["default"] = (function (path, _a) {
    var logs = _a.file.logs, scope = _a.scope, modifiers = _a.modifiers;
    var lastScope = scope.last();
    if (lastScope.type !== 'file') {
        logs.add(path.node.loc.start.line, "An export declaration can only be used at the top level of a module." /* ENRELogEntry['An export declaration can only be used at the top level of a module'] */);
        return;
    }
    var type = path.node.declaration.type;
    if ([
        'FunctionDeclaration',
        'ClassDeclaration',
        'TSInterfaceDeclaration'
    ].includes(type)) {
        var key = "".concat(path.node.loc.start.line, ":").concat(path.node.loc.start.column);
        var validRange = [];
        // Named entity
        if ('id' in path.node.declaration && path.node.declaration.id) {
            validRange.push((0, location_1.toENRELocation)(path.node.declaration.id.loc, location_1.ToENRELocationPolicy.Full));
        }
        /**
         * Anonymous entity
         *                Entity location
         *                V
         * export default class {
         *                ^-----^
         *                Use this as valid range
         */
        else {
            if ('body' in path.node.declaration) {
                validRange.push({
                    start: {
                        line: path.node.declaration.loc.start.line,
                        column: path.node.declaration.loc.start.column
                    },
                    end: {
                        line: path.node.declaration.body.loc.start.line,
                        column: path.node.declaration.body.loc.start.column
                    }
                });
            }
        }
        modifiers.set(key, {
            type: modifier_1.ModifierType["export"],
            proposer: lastScope,
            validRange: validRange,
            isDefault: true
        });
    }
    // See docs/relation/export.md#default-export-identifier-and-assignment-expressions
    else if (type === 'Identifier') {
        data_1.pseudoR.add({
            type: 'export',
            from: lastScope,
            to: { role: 'any', identifier: path.node.declaration.name, at: lastScope },
            location: (0, location_1.toENRELocation)(path.node.declaration.loc),
            kind: 'any',
            isDefault: true,
            isAll: false
        });
    }
    else if (type === 'UpdateExpression') {
        if (path.node.declaration.argument.type === 'Identifier') {
            data_1.pseudoR.add({
                type: 'export',
                from: lastScope,
                to: { role: 'any', identifier: path.node.declaration.argument.name, at: lastScope },
                location: (0, location_1.toENRELocation)(path.node.declaration.argument.loc),
                kind: 'any',
                isDefault: true,
                isAll: false
            });
        }
    }
    else if (type === 'AssignmentExpression') {
        if (path.node.declaration.left.type === 'Identifier') {
            data_1.pseudoR.add({
                type: 'export',
                from: lastScope,
                to: { role: 'any', identifier: path.node.declaration.left.name, at: lastScope },
                location: (0, location_1.toENRELocation)(path.node.declaration.left.loc),
                kind: 'any',
                isDefault: true,
                isAll: false
            });
        }
    }
});
