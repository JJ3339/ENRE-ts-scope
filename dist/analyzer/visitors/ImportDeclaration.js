"use strict";
/**
 * ImportDeclaration
 *
 * Extracted relations:
 *   * Import
 */
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var module_resolver_1 = require("../module-resolver");
var ExportNamedDeclaration_1 = require("./ExportNamedDeclaration");
var naming_1 = require("@enre-ts/naming");
exports["default"] = (function (path, _a) {
    var logs = _a.file.logs, scope = _a.scope;
    var lastScope = scope.last();
    if (lastScope.type !== 'file') {
        logs.add(path.node.loc.start.line, "An import declaration can only be used at the top level of a module." /* ENRELogEntry['An import declaration can only be used at the top level of a module'] */);
        return;
    }
    // TODO: Investigate 'typeof' importKind
    var symbolRole = path.node.importKind === 'type' ? 'type' : 'any';
    var resolvedModule = (0, module_resolver_1["default"])(lastScope, path.node.source.value);
    if (resolvedModule) {
        // Side-effect-only import
        if (path.node.specifiers.length === 0) {
            (0, data_1.recordRelationImport)(lastScope, resolvedModule, (0, location_1.toENRELocation)(path.node.loc), {
                kind: symbolRole,
                sourceRange: (0, location_1.toENRELocation)(path.node.source.loc, location_1.ToENRELocationPolicy.Full)
            });
        }
        else {
            for (var _i = 0, _b = path.node.specifiers; _i < _b.length; _i++) {
                var sp = _b[_i];
                if (sp.type === 'ImportDefaultSpecifier') {
                    if (resolvedModule.id >= 0) {
                        data_1.pseudoR.add({
                            type: 'import',
                            from: lastScope,
                            to: { role: 'default-export', at: resolvedModule },
                            location: (0, location_1.toENRELocation)(sp.local.loc),
                            sourceRange: (0, location_1.toENRELocation)(path.node.source.loc, location_1.ToENRELocationPolicy.Full),
                            alias: (0, data_1.recordEntityAlias)(new naming_1["default"]('Norm', sp.local.name), (0, location_1.toENRELocation)(sp.local.loc), lastScope),
                            kind: symbolRole
                        });
                    }
                    else {
                        // If the unknown default export was already recorded,
                        var unknownDefaultExport = resolvedModule.children.find(function (i) { return i.role === 'default-export'; });
                        // If not.
                        if (!unknownDefaultExport) {
                            unknownDefaultExport = (0, data_1.recordThirdPartyEntityUnknown)(new naming_1["default"]('Unk'), resolvedModule, 'default-export');
                        }
                        (0, data_1.recordRelationImport)(lastScope, unknownDefaultExport, (0, location_1.toENRELocation)(sp.loc), {
                            kind: 'any',
                            sourceRange: (0, location_1.toENRELocation)(path.node.source.loc, location_1.ToENRELocationPolicy.Full),
                            alias: (0, data_1.recordEntityAlias)(new naming_1["default"]('Norm', sp.local.name), (0, location_1.toENRELocation)(sp.local.loc), lastScope)
                        });
                    }
                }
                else if (sp.type === 'ImportNamespaceSpecifier') {
                    (0, data_1.recordRelationImport)(lastScope, resolvedModule, (0, location_1.toENRELocation)(sp.loc), {
                        kind: symbolRole,
                        sourceRange: (0, location_1.toENRELocation)(path.node.source.loc, location_1.ToENRELocationPolicy.Full),
                        alias: (0, data_1.recordEntityAlias)(new naming_1["default"]('Norm', sp.local.name), (0, location_1.toENRELocation)(sp.local.loc), lastScope)
                    });
                }
                else if (sp.type === 'ImportSpecifier') {
                    var isImportDefault = (sp.imported.type === 'StringLiteral' ? sp.imported.value : sp.imported.name) === 'default';
                    var alias = (0, ExportNamedDeclaration_1.getAliasEnt)(sp, lastScope);
                    if (resolvedModule.id >= 0) {
                        data_1.pseudoR.add({
                            type: 'import',
                            from: lastScope,
                            to: isImportDefault ?
                                {
                                    role: 'default-export',
                                    at: resolvedModule
                                } :
                                {
                                    role: 'any',
                                    identifier: sp.imported.type === 'StringLiteral' ? sp.imported.value : sp.imported.name,
                                    at: resolvedModule,
                                    exportsOnly: true
                                },
                            location: (0, location_1.toENRELocation)(sp.imported.loc),
                            sourceRange: (0, location_1.toENRELocation)(path.node.loc, location_1.ToENRELocationPolicy.Full),
                            kind: symbolRole,
                            alias: alias
                        });
                    }
                    else {
                        if (isImportDefault) {
                            // If the unknown default export was already recorded,
                            var unknownDefaultExport = resolvedModule.children.find(function (i) { return i.role === 'default-export'; });
                            // If not.
                            if (!unknownDefaultExport) {
                                unknownDefaultExport = (0, data_1.recordThirdPartyEntityUnknown)(new naming_1["default"]('Unk'), resolvedModule, 'default-export');
                            }
                            (0, data_1.recordRelationImport)(lastScope, unknownDefaultExport, (0, location_1.toENRELocation)(sp.loc), {
                                kind: 'any',
                                sourceRange: (0, location_1.toENRELocation)(path.node.loc, location_1.ToENRELocationPolicy.Full),
                                alias: alias
                            });
                        }
                        else {
                            (0, data_1.recordRelationImport)(lastScope, (0, data_1.recordThirdPartyEntityUnknown)(sp.imported.type === 'StringLiteral' ? new naming_1["default"]('Str', sp.imported.value) : new naming_1["default"]('Norm', sp.imported.name), resolvedModule, 'normal'), (0, location_1.toENRELocation)(sp.loc), {
                                kind: 'any',
                                sourceRange: (0, location_1.toENRELocation)(path.node.loc, location_1.ToENRELocationPolicy.Full),
                                alias: alias
                            });
                        }
                    }
                }
            }
        }
    }
});
