"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
var binding_pattern_handler_1 = require("./binding-pattern-handler");
var data_1 = require("@enre-ts/data");
var naming_1 = require("@enre-ts/naming");
function onRecord(name, location, scope, path, defaultAlter) {
    var entity = (0, data_1.recordEntityParameter)(new naming_1.default('Norm', name), location, scope.last(), { path: path, defaultAlter: defaultAlter });
    scope.last().children.push(entity);
    return entity;
}
function default_1(node, scope, logs, onRecordField) {
    var params;
    if (node.type === 'CatchClause') {
        if (node.param) {
            params = [node.param];
        }
        else {
            return;
        }
    }
    else {
        params = node.params;
    }
    for (var _i = 0, _a = Object.entries(params); _i < _a.length; _i++) {
        var _b = _a[_i], index = _b[0], param = _b[1];
        if (param.type === 'Identifier' && param.name === 'this') {
            continue;
        }
        var prefix = [{ type: 'array' }];
        if (param.type === 'RestElement') {
            prefix.push({ type: 'rest', start: index });
        }
        else {
            prefix.push({ type: 'key', key: index });
        }
        if (node.type === 'ClassMethod' && node.kind === 'constructor' && param.type === 'TSParameterProperty') {
            (0, binding_pattern_handler_1.default)(param, scope, prefix, onRecord, onRecordField);
        }
        else if (param.type === 'TSParameterProperty') {
            logs.add(node.loc.start.line, "A parameter property(field) is only allowed in a constructor implementation." /* ENRELogEntry['A parameter field is only allowed in a constructor implementation'] */);
            /**
             * In this case, only (and should only) extract parameter entities.
             * By not sending onRecordField, the function will not record any field entities.
             */
            (0, binding_pattern_handler_1.default)(param, scope, prefix, onRecord);
        }
        else {
            (0, binding_pattern_handler_1.default)(param, scope, prefix, onRecord);
        }
    }
}
