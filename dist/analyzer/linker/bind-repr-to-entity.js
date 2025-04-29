"use strict";
exports.__esModule = true;
var lookup_1 = require("./lookup");
var lookdown_1 = require("./lookdown");
/**
 * Find what a symbol reference within an JSObjRepr refers to and IN PLACE replace it
 * with the symbol's pointsTo.
 */
function bind(objRepr, scope) {
    if (objRepr.type === 'reference') {
        var found = (0, lookup_1["default"])({
            role: 'value',
            identifier: objRepr.value,
            at: scope
        });
        if (found) {
            return found;
        }
    }
    else if (objRepr.type === 'receipt') {
        var found = (0, lookdown_1["default"])('loc-key', objRepr.key, scope);
        if (found) {
            return found;
        }
    }
    else if (objRepr.type === 'object') {
        for (var _i = 0, _a = Object.entries(objRepr.kv); _i < _a.length; _i++) {
            var _b = _a[_i], index = _b[0], item = _b[1];
            var resolved = bind(item, scope);
            // @ts-ignore
            objRepr.kv[index] = resolved;
        }
    }
    // If parameter is already an ENREEntity, then return it without any modification.
    return objRepr;
}
exports["default"] = bind;
