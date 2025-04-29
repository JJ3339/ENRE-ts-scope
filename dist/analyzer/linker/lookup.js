"use strict";
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var core_1 = require("@enre-ts/core");
function default_1(sg, omitAlias) {
    var _a, _b, _c, _d;
    if (omitAlias === void 0) { omitAlias = false; }
    /**
     * Though multiple entities in the same scope cannot have duplicated identifier,
     * it is still possible for a JS value entity and TS type entity to remain
     * the same identifier, while importing/exporting, it is both two entities
     * are imported/exported.
     */
    var results = [];
    var curr = sg.at;
    // Find only default export
    if (sg.role === 'default-export') {
        if (curr.type !== 'file') {
            core_1.logger.error("Cannot find default export in ".concat(curr.type, " entity, expecting file entity."));
            return;
        }
        // Single entity or a value entity and a type entity
        return curr.exports.filter(function (r) { return r.isDefault; }).map(function (r) { return r.to; });
    }
    // Find only in named exports
    else if (sg.exportsOnly) {
        if (curr.type !== 'file') {
            core_1.logger.error("Cannot find exports in ".concat(curr.type, " entity, expecting file entity."));
            return;
        }
        for (var _i = 0, _e = curr.exports; _i < _e.length; _i++) {
            var exportRelation = _e[_i];
            var aliasName = (_a = exportRelation.alias) === null || _a === void 0 ? void 0 : _a.name.payload;
            if (!exportRelation.isDefault &&
                (aliasName === sg.identifier
                    // export.to shouldn't be a file, since this case should be directly bound in the traverse phase.
                    || exportRelation.to.name.codeName === sg.identifier)) {
                var returned = (_b = exportRelation.alias) !== null && _b !== void 0 ? _b : exportRelation.to;
                // @ts-ignore
                if ((sg.role === 'value' && data_1.valueEntityTypes.includes(exportRelation.to.type)) ||
                    // @ts-ignore
                    (sg.role === 'type' && data_1.typeEntityTypes.includes(exportRelation.to.type))) {
                    return returned;
                }
                else if (sg.role === 'any') {
                    results.push(returned);
                }
            }
        }
    }
    // Find according to symbol scope
    else {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            for (var _f = 0, _g = curr.children; _f < _g.length; _f++) {
                var e = _g[_f];
                // TODO: Refactor this to clearly distinguish valid identifier and string literal
                if (sg.identifier === e.name.codeName) {
                    // @ts-ignore
                    if ((sg.role === 'value' && data_1.valueEntityTypes.includes(e.type)) ||
                        // @ts-ignore
                        (sg.role === 'type' && data_1.typeEntityTypes.includes(e.type))) {
                        return e;
                    }
                    else if (sg.role === 'any') {
                        // Does not return in case two entities are not in the same scope
                        results.push(e);
                    }
                }
            }
            // TODO: Handle TS namespace import/export
            if (curr.type === 'file') {
                // Also find in file entity's import
                if (!sg.localOnly) {
                    for (var _h = 0, _j = curr.imports; _h < _j.length; _h++) {
                        var importRelation = _j[_h];
                        /**
                         * Import alias (if any) can only be identifier.
                         *
                         * Not side effect import, the other case of `file-import->file` is namespace import,
                         * which will always correspond an alias entity.
                         */
                        if (((_c = importRelation.alias) === null || _c === void 0 ? void 0 : _c.name.payload) === sg.identifier ||
                            (importRelation.to.type !== 'file' && importRelation.to.name.codeName === sg.identifier)) {
                            var returned = (_d = importRelation.alias) !== null && _d !== void 0 ? _d : importRelation.to;
                            if (omitAlias) {
                                while (returned.type === 'alias') {
                                    returned = returned.ofRelation.to;
                                }
                            }
                            // @ts-ignore
                            if ((sg.role === 'value' && data_1.valueEntityTypes.includes(importRelation.to.type)) ||
                                // @ts-ignore
                                (sg.role === 'type' && data_1.typeEntityTypes.includes(importRelation.to.type))) {
                                return returned;
                            }
                            else if (sg.role === 'any') {
                                results.push(returned);
                            }
                        }
                    }
                }
                // Break the lookup
                break;
            }
            else {
                curr = curr.parent;
            }
        }
        // TODO: Find in built-in
    }
    if (sg.role === 'any') {
        return results;
    }
    else {
        // Found no desired symbol
        return undefined;
    }
}
exports["default"] = default_1;
