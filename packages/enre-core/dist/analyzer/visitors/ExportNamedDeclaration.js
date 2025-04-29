"use strict";
/**
 * ExportNamedDeclaration
 *
 * Extracted entities:
 *   * Alias
 *
 * Extracted relations:
 *   * Export
 *   - AliasOf (will not be bound until the corresponding export relation is successfully bound)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAliasEnt = void 0;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var modifier_1 = require("../context/modifier");
var module_resolver_1 = require("../module-resolver");
var naming_1 = require("@enre-ts/naming");
// Alias entity should be added to container in the relation resolving phase.
var getAliasEnt = function (sp, scope) {
    if ((sp.type === 'ExportSpecifier' && sp.local.start !== sp.exported.start) || sp.type === 'ExportNamespaceSpecifier') {
        var name_1;
        if (sp.exported.type === 'StringLiteral') {
            name_1 = new naming_1.default('Str', sp.exported.value);
        }
        else {
            name_1 = new naming_1.default('Norm', sp.exported.name);
        }
        return (0, data_1.recordEntityAlias)(name_1, (0, location_1.toENRELocation)(sp.exported.loc), scope);
    }
    else if (sp.type === 'ImportSpecifier' && sp.local.start !== sp.imported.start) {
        return (0, data_1.recordEntityAlias)(new naming_1.default('Norm', sp.local.name), (0, location_1.toENRELocation)(sp.local.loc), scope);
    }
    else {
        return undefined;
    }
};
exports.getAliasEnt = getAliasEnt;
exports.default = {
    enter: function (path, _a) {
        var logs = _a.file.logs, scope = _a.scope, modifiers = _a.modifiers;
        var lastScope = scope.last();
        if (!['file', 'namespace'].includes(lastScope.type)) {
            logs.add(path.node.loc.start.line, "An export declaration can only be used at the top level of a module." /* ENRELogEntry['An export declaration can only be used at the top level of a module'] */);
            return;
        }
        var symbolRole = path.node.exportKind === 'type' ? 'type' : 'any';
        // Reexports
        if (path.node.source) {
            var resolvedModule = (0, module_resolver_1.default)(lastScope, path.node.source.value);
            if (resolvedModule) {
                var sps = path.node.specifiers;
                if (sps.length === 0) {
                    /**
                     * This corresponds to `export {} from 'mod'`, which behaves to what like a side effect import.
                     * However, TypeScript removes this declaration, which is different to ECMAScript.
                     * Maybe we should report this as an issue?
                     *
                     * TODO: Report this as issue and throw warning
                     */
                    (0, data_1.recordRelationExport)(lastScope, resolvedModule, (0, location_1.toENRELocation)(path.node.loc), {
                        kind: symbolRole,
                        isDefault: false,
                        isAll: false,
                        sourceRange: (0, location_1.toENRELocation)(path.node.source.loc, location_1.ToENRELocationPolicy.Full),
                    });
                }
                else {
                    if (sps.filter(function (sp) { return sp.type === 'ExportSpecifier'; }).length !== 0 &&
                        sps.filter(function (sp) { return sp.type !== 'ExportSpecifier'; }).length !== 0) {
                        /**
                         * This corresponds to `export * as x, {a as b} from 'mod'`,
                         * which is an invalid yet parsed syntax.
                         *
                         * Update: babel has fixed this.
                         */
                        // TODO: Throw warning?
                    }
                    for (var _i = 0, sps_1 = sps; _i < sps_1.length; _i++) {
                        var sp = sps_1[_i];
                        if (sp.type === 'ExportSpecifier') {
                            // @ts-ignore The type of local node of an ExportSpecifier can be StringLiteral
                            var isImportDefault = (sp.local.type === 'StringLiteral' ? sp.local.value : sp.local.name) === 'default';
                            var isExportDefault = (sp.exported.type === 'StringLiteral' ? sp.exported.value : sp.exported.name) === 'default';
                            // Judging if there are multiple default export will be postponed to binding phase.
                            var alias = (0, exports.getAliasEnt)(sp, lastScope);
                            data_1.pseudoR.add({
                                type: 'export',
                                from: lastScope,
                                to: isImportDefault ?
                                    {
                                        role: 'default-export',
                                        at: resolvedModule,
                                    } :
                                    {
                                        role: 'any',
                                        // @ts-ignore
                                        identifier: sp.local.type === 'StringLiteral' ? sp.local.value : sp.local.name,
                                        at: resolvedModule,
                                        localOnly: true,
                                    },
                                location: (0, location_1.toENRELocation)(sp.local.loc),
                                sourceRange: (0, location_1.toENRELocation)(path.node.source.loc, location_1.ToENRELocationPolicy.Full),
                                isDefault: isExportDefault,
                                isAll: false,
                                kind: symbolRole,
                                alias: alias,
                            });
                        }
                        else if (sp.type === 'ExportNamespaceSpecifier') {
                            // @ts-ignore
                            var isDefault = (sp.exported.type === 'StringLiteral' ? sp.exported.value : sp.exported.name) === 'default';
                            var alias = (0, exports.getAliasEnt)(sp, lastScope);
                            (0, data_1.recordRelationExport)(lastScope, resolvedModule, (0, location_1.toENRELocation)(sp.loc), {
                                kind: symbolRole,
                                isDefault: isDefault,
                                isAll: true,
                                sourceRange: (0, location_1.toENRELocation)(path.node.source.loc, location_1.ToENRELocationPolicy.Full),
                                alias: alias,
                            });
                        }
                        else if (sp.type === 'ExportDefaultSpecifier') {
                            // Impossible syntax
                        }
                    }
                }
            }
            else {
                // TODO: Cannot find the module
            }
        }
        // Regular export
        else {
            for (var _b = 0, _c = path.node.specifiers; _b < _c.length; _b++) {
                var sp = _c[_b];
                if (sp.type === 'ExportSpecifier') {
                    var alias = (0, exports.getAliasEnt)(sp, lastScope);
                    data_1.pseudoR.add({
                        type: 'export',
                        from: lastScope,
                        to: {
                            role: 'any',
                            identifier: sp.local.name,
                            at: lastScope,
                        },
                        location: (0, location_1.toENRELocation)(sp.local.loc),
                        kind: symbolRole,
                        isDefault: false,
                        isAll: false,
                        alias: alias,
                    });
                }
                else {
                    // Impossible syntax
                }
            }
            if (path.node.declaration) {
                var key = "".concat(path.node.loc.start.line, ":").concat(path.node.loc.start.column);
                var validRange = [];
                /**
                 * VariableDeclaration may produce multiple entities,
                 * and they should all be exported.
                 */
                if (path.node.declaration.type === 'VariableDeclaration') {
                    for (var _d = 0, _e = path.node.declaration.declarations; _d < _e.length; _d++) {
                        var decl = _e[_d];
                        validRange.push((0, location_1.toENRELocation)(decl.id.loc, location_1.ToENRELocationPolicy.Full));
                    }
                }
                else if ('id' in path.node.declaration) {
                    validRange.push((0, location_1.toENRELocation)(path.node.declaration.id.loc, location_1.ToENRELocationPolicy.Full));
                }
                modifiers.set(key, {
                    type: modifier_1.ModifierType.export,
                    proposer: lastScope,
                    validRange: validRange,
                    isDefault: false,
                });
            }
        }
    },
    exit: function (path, _a) {
        var modifiers = _a.modifiers;
        if (path.node.declaration) {
            var key = "".concat(path.node.loc.start.line, ":").concat(path.node.loc.start.column);
            modifiers.delete(key);
        }
    }
};
