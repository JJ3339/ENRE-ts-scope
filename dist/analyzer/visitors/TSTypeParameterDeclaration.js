"use strict";
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
exports["default"] = (function (path, _a) {
    var _b;
    var logs = _a.file.logs, scope = _a.scope;
    if (path.node.params.length === 0) {
        logs.add(path.node.loc.start.line, "Type parameter list cannot be empty." /* ENRELogEntry['Type parameter list cannot be empty'] */);
        return;
    }
    if (scope.last().type === 'method' && ['get', 'set'].includes(scope.last().kind)) {
        logs.add(path.node.loc.start.line, "An accessor cannot have type parameters." /* ENRELogEntry['An accessor cannot have type parameters'] */);
        return;
    }
    for (var _i = 0, _c = path.node.params; _i < _c.length; _i++) {
        var tp = _c[_i];
        if (tp["const"] && ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration'].indexOf(path.parent.type) !== -1) {
            logs.add(path.node.loc.start.line, "'const' modifier can only appear on a type parameter of a function, method or class." /* ENRELogEntry['const modifier can only appear on a type parameter of a function, method or class'] */);
            return;
        }
        /**
         * For `const T`, @babel/parser as of 7.21.8 does not provide the range of identifier `T`,
         * whereas the location contains the `const` keyword. A workaround is easy, but we should
         * propose an issue to babel.
         */
        var startColumn = tp.loc.start.column;
        if (tp["const"]) {
            startColumn = tp.loc.end.column - tp.name.length;
        }
        var entity = (0, data_1.recordEntityTypeParameter)(new naming_1["default"]('Norm', tp.name), (0, location_1.toENRELocation)({
            start: {
                line: tp.loc.start.line,
                column: startColumn
            }
        }), scope.last(), {
            isConst: (_b = tp["const"]) !== null && _b !== void 0 ? _b : false
        });
        scope.last().children.push(entity);
        if (tp.constraint) {
            if (tp.constraint.type === 'TSTypeReference') {
                if (tp.constraint.typeName.type === 'Identifier') {
                    data_1.pseudoR.add({
                        type: 'extend',
                        from: entity,
                        to: { role: 'type', identifier: tp.constraint.typeName.name, at: scope.last() },
                        location: (0, location_1.toENRELocation)(tp.constraint.typeName.loc)
                    });
                }
            }
        }
    }
});
