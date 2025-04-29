"use strict";
exports.__esModule = true;
exports.getRest = exports.createJSObjRepr = void 0;
var location_1 = require("@enre-ts/location");
function createJSObjRepr(kvInitial) {
    return {
        type: 'object',
        kv: {},
        kvInitial: kvInitial,
        prototype: undefined,
        callable: []
    };
}
exports.createJSObjRepr = createJSObjRepr;
function resolve(node) {
    var _a, _b;
    if (!node) {
        return undefined;
    }
    if (node.type === 'Identifier') {
        return {
            type: 'reference',
            value: node.name,
            location: (0, location_1.toENRELocation)(node.loc, location_1.ToENRELocationPolicy.PartialEnd)
        };
    }
    else if (node.type === 'ArrayExpression') {
        var objRepr = createJSObjRepr('array');
        for (var _i = 0, _c = Object.entries(node.elements); _i < _c.length; _i++) {
            var _d = _c[_i], index = _d[0], element = _d[1];
            // @ts-ignore
            var resolved = resolve(element);
            if (resolved) {
                // @ts-ignore
                objRepr.kv[index] = resolved;
            }
        }
        return objRepr;
    }
    else if (node.type === 'ObjectExpression') {
        var objRepr = createJSObjRepr('obj');
        for (var _e = 0, _f = node.properties; _e < _f.length; _e++) {
            var property = _f[_e];
            if (property.type === 'ObjectProperty') {
                // @ts-ignore
                var resolved = resolve(property.value);
                if (resolved) {
                    if (property.key.type === 'Identifier') {
                        objRepr.kv[property.key.name] = resolved;
                    }
                    else if (property.key.type === 'NumericLiteral') {
                        objRepr.kv[property.key.value] = resolved;
                    }
                    else if (property.key.type === 'StringLiteral') {
                        objRepr.kv[property.key.value] = resolved;
                    }
                }
            }
        }
        return objRepr;
    }
    else if (['FunctionExpression', 'ClassExpression', 'ArrowFunctionExpression'].includes(node.type)) {
        return {
            type: 'receipt',
            // @ts-ignore
            key: (0, location_1.toENRELocKey)((_b = (_a = node.id) === null || _a === void 0 ? void 0 : _a.loc) !== null && _b !== void 0 ? _b : node.loc)
        };
    }
    else if (['StringLiteral', 'NumericLiteral', 'BooleanLiteral'].includes(node.type)) {
        return {
            // @ts-ignore
            type: {
                StringLiteral: 'string',
                NumericLiteral: 'number',
                BooleanLiteral: 'boolean'
            }[node.type],
            // @ts-ignore
            value: node.value
        };
    }
    return undefined;
}
exports["default"] = resolve;
// Uses a cache to avoid duplicate object creation
var cachedRestObjs = new Map();
function getRest(objRepr, rest) {
    if (!cachedRestObjs.has(objRepr)) {
        cachedRestObjs.set(objRepr, new Map());
    }
    // Get the previously created new rest JSObjRepr (if exist)
    var newRepr = cachedRestObjs.get(objRepr).get(rest);
    // kv still needs to be re-evaluated since parameter objRepr could have kv updated
    // Object rest
    if ('exclude' in rest) {
        if (!newRepr) {
            newRepr = createJSObjRepr('obj');
        }
        for (var _i = 0, _a = Object.entries(objRepr.kv); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (!rest.exclude.includes(key)) {
                newRepr.kv[key] = value;
            }
        }
    }
    // Array rest
    else if ('start' in rest) {
        if (!newRepr) {
            newRepr = createJSObjRepr('array');
        }
        var newCounter = 0;
        if (objRepr.callable.iterator) {
            // @ts-ignore
            for (var _c = 0, _d = Object.entries(objRepr.callable.iterator.pointsTo[0].callable[0].returns); _c < _d.length; _c++) {
                var _e = _d[_c], key = _e[0], value = _e[1];
                // @ts-ignore
                if (parseInt(key) >= parseInt(rest.start)) {
                    // @ts-ignore
                    newRepr.kv[newCounter] = value.pointsTo[0];
                    newCounter += 1;
                }
            }
        }
        else {
            for (var _f = 0, _g = Object.entries(objRepr.kv); _f < _g.length; _f++) {
                var _h = _g[_f], key = _h[0], value = _h[1];
                // @ts-ignore
                if (parseInt(key) >= parseInt(rest.start)) {
                    newRepr.kv[newCounter] = value;
                    newCounter += 1;
                }
            }
        }
    }
    if (newRepr && cachedRestObjs.get(objRepr)) {
        cachedRestObjs.get(objRepr).set(rest, newRepr);
    }
    return newRepr;
}
exports.getRest = getRest;
