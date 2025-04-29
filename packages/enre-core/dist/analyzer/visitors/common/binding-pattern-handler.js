"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
var location_1 = require("@enre-ts/location");
var literal_handler_1 = require("./literal-handler");
function default_1(id, scope, overridePrefix, onRecord, onRecordConstructorField) {
    return recursiveTraverse(id, overridePrefix !== null && overridePrefix !== void 0 ? overridePrefix : [{ type: 'start' }]).map(function (item) {
        /**
         * If the AST node represents a TypeScript constructor parameter field,
         * a field entity (of the class entity) and a field entity with the same name & location
         * (of the constructor entity) are created, and only the parameter entity is returned.
         */
        if (id.type === 'TSParameterProperty') {
            onRecordConstructorField ? onRecordConstructorField(item.name, item.location, scope, id.accessibility) : undefined;
        }
        return {
            path: item.path,
            entity: onRecord(item.name, item.location, scope, item.path, item.default),
            default: item.default,
        };
    });
}
function recursiveTraverse(id, prefix) {
    // TODO: Snapshot test this function based on test cases in /docs/entity/variable.md
    var _a, _b, _c;
    var result = [];
    switch (id.type) {
        case 'Identifier': {
            var _prefix = __spreadArray([], prefix, true);
            if (!(
            // Do not add identifier name to path if it is not a destructuring pattern
            (prefix.length === 1 && prefix[0].type === 'start')
                // Do not add identifier name if it is an array pattern
                || ((_a = prefix.at(-2)) === null || _a === void 0 ? void 0 : _a.type) === 'array'
                // Do not add identifier name if it is an object value
                || ((_b = prefix.at(-2)) === null || _b === void 0 ? void 0 : _b.type) === 'obj')) {
                _prefix.push({ type: 'key', key: id.name });
            }
            result.push({
                path: _prefix,
                name: id.name,
                location: (0, location_1.toENRELocation)(id.loc)
            });
            break;
        }
        case 'AssignmentPattern': {
            for (var _i = 0, _d = recursiveTraverse(id.left, prefix); _i < _d.length; _i++) {
                var item = _d[_i];
                item.default = (0, literal_handler_1.default)(id.right);
                result.push(item);
            }
            break;
        }
        case 'ObjectPattern': {
            var usedProps = [];
            for (var _e = 0, _f = id.properties; _e < _f.length; _e++) {
                var property = _f[_e];
                if (property.type === 'RestElement') {
                    // Its argument can ONLY be Identifier
                    var _prefix = __spreadArray([], prefix, true);
                    _prefix.push.apply(_prefix, [{ type: 'obj' }, {
                            type: 'rest',
                            exclude: usedProps
                        }]);
                    for (var _g = 0, _h = recursiveTraverse(property.argument, _prefix); _g < _h.length; _g++) {
                        var item = _h[_g];
                        result.push(item);
                    }
                }
                else {
                    // TODO: Unified get key
                    var _prefix = __spreadArray(__spreadArray([], prefix, true), [{ type: 'obj' }], false);
                    if (property.key.type === 'Identifier' &&
                        ((property.value.type === 'Identifier' && property.key.name !== property.value.name) ||
                            property.value.type !== 'Identifier')) {
                        // @ts-ignore
                        usedProps.push((_c = property.key.name) !== null && _c !== void 0 ? _c : property.key.value);
                        _prefix.push({ type: 'key', key: property.key.name });
                    }
                    else if (property.key.type === 'NumericLiteral') {
                        usedProps.push(property.key.value);
                        _prefix.push({ type: 'key', key: property.key.value });
                    }
                    else if (property.key.type === 'StringLiteral') {
                        usedProps.push(property.key.value);
                        _prefix.push({ type: 'key', key: property.key.value });
                    }
                    // property.type === 'ObjectProperty'
                    // @ts-ignore
                    for (var _j = 0, _k = recursiveTraverse(property.value, _prefix); _j < _k.length; _j++) {
                        var item = _k[_j];
                        result.push(item);
                    }
                }
            }
            break;
        }
        case 'ArrayPattern':
            for (var _l = 0, _m = id.elements; _l < _m.length; _l++) {
                var element = _m[_l];
                if (element === null) {
                    result.push(undefined);
                }
                else if (element.type === 'RestElement') {
                    // Its argument can STILL be a pattern
                    // Rest operator can be used with comma elision, elements before the rest operator are not put into the rest variable
                    var _prefix = __spreadArray([], prefix, true);
                    _prefix.push.apply(_prefix, [{ type: 'array' }, {
                            type: 'rest',
                            start: result.length.toString()
                        }]);
                    for (var _o = 0, _p = recursiveTraverse(element.argument, _prefix); _o < _p.length; _o++) {
                        var item = _p[_o];
                        result.push(item);
                    }
                }
                else {
                    // element.type === 'PatternLike'
                    var _prefix = __spreadArray([], prefix, true);
                    _prefix.push.apply(_prefix, [{ type: 'array' }, {
                            type: 'key',
                            key: result.length.toString()
                        }]);
                    for (var _q = 0, _r = recursiveTraverse(element, _prefix); _q < _r.length; _q++) {
                        var item = _r[_q];
                        result.push(item);
                    }
                }
            }
            break;
        case 'TSParameterProperty':
            if (id.parameter.type === 'Identifier') {
                result.push.apply(result, recursiveTraverse(id.parameter, prefix));
            }
            // id.parameter.type === 'AssignmentPattern'
            else {
                if (id.parameter.left.type === 'Identifier') {
                    result.push.apply(result, recursiveTraverse(id.parameter.left, prefix));
                }
                else if (['ArrayPattern', 'ObjectPattern'].includes(id.parameter.left.type)) {
                    // Indeed invalid syntax
                    result.push.apply(result, recursiveTraverse(id.parameter.left, prefix));
                }
                else {
                    // console.warn(`Unhandled BindingPattern type ${id.parameter.left.type}`);
                }
            }
            break;
        /**
         * For callable's rest parameters only.
         * Regular object and array's rest are handled in their own case branch.
         */
        case 'RestElement':
            for (var _s = 0, _t = recursiveTraverse(id.argument, prefix); _s < _t.length; _s++) {
                var item = _t[_s];
                result.push(item);
            }
    }
    // Remove `undefined` (placeholder for array destructuring with comma elision)
    return result.filter(function (item) { return item !== undefined; });
}
