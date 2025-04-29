"use strict";
/**
 * ClassProperty|ClassPrivateProperty
 *
 * Extracted entities:
 *   * Field
 *   * Method
 */
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
exports["default"] = (function (path, _a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var _m = _a.file, lang = _m.lang, logs = _m.logs, scope = _a.scope;
    var key = path.node.key;
    var entity;
    // @ts-ignore
    if (path.node.abstract && !scope.last().isAbstract) {
        logs.add(path.node.loc.start.line, "Abstract fields can only appear within an abstract class." /* ENRELogEntry['Abstract fields can only appear within an abstract class'] */);
        return;
    }
    if (path.node.type === 'ClassPrivateProperty') {
        // @ts-ignore
        if (path.node.accessibility) {
            logs.add(path.node.loc.start.line, "An accessibility modifier cannot be used with a private identifier." /* ENRELogEntry['An accessibility modifier cannot be used with a private identifier'] */);
            return;
        }
        // @ts-ignore
        if (path.node.abstract) {
            logs.add(path.node.loc.start.line, "'abstract' modifier cannot be used with a private identifier." /* ENRELogEntry['abstract modifier cannot be used with a private identifier'] */);
            return;
        }
        entity = (0, data_1.recordEntityField)(new naming_1["default"]('Pvt', key.id.name), (0, location_1.toENRELocation)(key.loc, location_1.ToENRELocationPolicy.PartialEnd), scope.last(), {
            isStatic: path.node.static,
            isPrivate: true
        });
    }
    else {
        if (path.node.abstract) {
            if (path.node.accessibility === 'private') {
                // Only `private` modifier is disabled for abstract field.
                logs.add(path.node.loc.start.line, "'{0}' modifier cannot be used with '{1}' modifier." /* ENRELogEntry['0 modifier cannot be used with 1 modifier'] */, 'private', 'abstract');
                return;
            }
            if (path.node.static) {
                logs.add(path.node.loc.start.line, "'{0}' modifier cannot be used with '{1}' modifier." /* ENRELogEntry['0 modifier cannot be used with 1 modifier'] */, 'static', 'abstract');
                return;
            }
        }
        switch (key.type) {
            case 'Identifier':
                entity = (0, data_1.recordEntityField)(new naming_1["default"]('Norm', key.name), (0, location_1.toENRELocation)(key.loc), scope.last(), {
                    isStatic: (_b = path.node.static) !== null && _b !== void 0 ? _b : false,
                    isAbstract: (_c = path.node.abstract) !== null && _c !== void 0 ? _c : false,
                    TSVisibility: (_d = path.node.accessibility) !== null && _d !== void 0 ? _d : (lang === 'ts' ? 'public' : undefined)
                });
                break;
            case 'StringLiteral':
                entity = (0, data_1.recordEntityField)(new naming_1["default"]('Str', key.value), (0, location_1.toENRELocation)(key.loc), scope.last(), {
                    isStatic: (_e = path.node.static) !== null && _e !== void 0 ? _e : false,
                    isAbstract: (_f = path.node.abstract) !== null && _f !== void 0 ? _f : false,
                    TSVisibility: (_g = path.node.accessibility) !== null && _g !== void 0 ? _g : (lang === 'ts' ? 'public' : undefined)
                });
                break;
            case 'NumericLiteral':
                entity = (0, data_1.recordEntityField)(new naming_1["default"]('Num', (_h = key.extra) === null || _h === void 0 ? void 0 : _h.raw, key.value), (0, location_1.toENRELocation)(key.loc), scope.last(), {
                    isStatic: (_j = path.node.static) !== null && _j !== void 0 ? _j : false,
                    isAbstract: (_k = path.node.abstract) !== null && _k !== void 0 ? _k : false,
                    TSVisibility: (_l = path.node.accessibility) !== null && _l !== void 0 ? _l : (lang === 'ts' ? 'public' : undefined)
                });
                break;
            default:
            // WONT-FIX: Extract name from a lot of expression kinds.
        }
    }
    if (entity) {
        scope.last().children.push(entity);
    }
});
