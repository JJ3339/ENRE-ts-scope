"use strict";
exports.__esModule = true;
var module_resolver_1 = require("../module-resolver");
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
exports["default"] = (function (path, _a) {
    var logs = _a.file.logs, scope = _a.scope;
    var lastScope = scope.last();
    if (lastScope.type !== 'file') {
        logs.add(path.node.loc.start.line, "An export declaration can only be used at the top level of a module." /* ENRELogEntry['An export declaration can only be used at the top level of a module'] */);
        return;
    }
    var symbolRole = path.node.exportKind === 'type' ? 'type' : 'any';
    var resolvedModule = (0, module_resolver_1["default"])(lastScope, path.node.source.value);
    if (resolvedModule) {
        (0, data_1.recordRelationExport)(lastScope, resolvedModule, (0, location_1.toENRELocation)(path.node.loc), {
            kind: symbolRole,
            isDefault: false,
            isAll: true,
            sourceRange: (0, location_1.toENRELocation)(path.node.source.loc, location_1.ToENRELocationPolicy.Full)
        });
    }
    else {
        // TODO: Cannot find the module
    }
});
