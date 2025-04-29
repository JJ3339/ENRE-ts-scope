"use strict";
/**
 * ClassMethod|ClassPrivateMethod
 *
 * Extracted entities:
 *   * Method
 *   * Parameter
 *   * Field
 */
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
var parameter_handler_1 = require("./common/parameter-handler");
var literal_handler_1 = require("./common/literal-handler");
var onRecordField = function (name, location, scope, TSVisibility) {
    var entity = (0, data_1.recordEntityField)(new naming_1["default"]('Norm', name), location, 
    // Scope stack: ... -> (-2) Class -> (-1) Constructor, field needs to be added to `Class`.
    scope.at(-2), 
    // Any other properties are all false
    {
        isStatic: false,
        isPrivate: false,
        isAbstract: false,
        TSVisibility: TSVisibility
    });
    scope.at(-2).children.push(entity);
    return entity;
};
var entity;
exports["default"] = {
    enter: function (path, _a) {
        var _b, _c, _d, _e, _f, _g, _h;
        var _j = _a.file, lang = _j.lang, logs = _j.logs, scope = _a.scope;
        var classEntity = scope.last();
        var key = path.node.key;
        if (path.node.abstract && !classEntity.isAbstract) {
            logs.add(path.node.loc.start.line, "Abstract methods can only appear within an abstract class." /* ENRELogEntry['Abstract methods can only appear within an abstract class'] */);
            return;
        }
        if (path.node.type === 'ClassPrivateMethod') {
            if (path.node.accessibility) {
                logs.add(path.node.loc.start.line, "An accessibility modifier cannot be used with a private identifier." /* ENRELogEntry['An accessibility modifier cannot be used with a private identifier'] */);
                return;
            }
            if (path.node.abstract) {
                logs.add(path.node.loc.start.line, "'abstract' modifier cannot be used with a private identifier." /* ENRELogEntry['abstract modifier cannot be used with a private identifier'] */);
                return;
            }
            entity = (0, data_1.recordEntityMethod)(new naming_1["default"]('Pvt', key.id.name), (0, location_1.toENRELocation)(key.loc, location_1.ToENRELocationPolicy.PartialEnd), classEntity, {
                /**
                 * PrivateMethod may not be a class constructor,
                 * maybe this type annotation of babel is inaccurate.
                 */
                kind: path.node.kind,
                isStatic: path.node.static,
                isPrivate: true,
                isGenerator: path.node.generator,
                isAsync: path.node.async
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
                if (path.node.kind === 'constructor') {
                    logs.add(path.node.loc.start.line, "Constructor cannot be 'abstract'" /* ENRELogEntry['Constructor cannot be abstract'] */);
                    return;
                }
                // TODO: Determine whether a method is an async / generator method according to its return type signature.
                if (path.node.async) {
                    logs.add(path.node.loc.start.line, "'{0}' modifier cannot be used with '{1}' modifier." /* ENRELogEntry['0 modifier cannot be used with 1 modifier'] */, 'async', 'abstract');
                    return;
                }
                if (path.node.generator) {
                    logs.add(path.node.loc.start.line, "An overload signature cannot be declared as a generator." /* ENRELogEntry['An overload signature cannot be declared as a generator'] */);
                    return;
                }
            }
            switch (key.type) {
                case 'Identifier':
                    entity = (0, data_1.recordEntityMethod)(new naming_1["default"]('Norm', key.name), (0, location_1.toENRELocation)(key.loc), classEntity, {
                        kind: path.node.kind,
                        isStatic: path.node.static,
                        isGenerator: path.node.generator,
                        isAsync: path.node.async,
                        isAbstract: (_b = path.node.abstract) !== null && _b !== void 0 ? _b : false,
                        TSVisibility: (_c = path.node.accessibility) !== null && _c !== void 0 ? _c : (lang === 'ts' ? 'public' : undefined)
                    });
                    break;
                case 'StringLiteral':
                    entity = (0, data_1.recordEntityMethod)(new naming_1["default"]('Str', key.value), (0, location_1.toENRELocation)(key.loc), classEntity, {
                        kind: path.node.kind,
                        isStatic: path.node.static,
                        isGenerator: path.node.generator,
                        isAsync: path.node.async,
                        isAbstract: (_d = path.node.abstract) !== null && _d !== void 0 ? _d : false,
                        TSVisibility: (_e = path.node.accessibility) !== null && _e !== void 0 ? _e : (lang === 'ts' ? 'public' : undefined)
                    });
                    break;
                case 'NumericLiteral':
                    entity = (0, data_1.recordEntityMethod)(new naming_1["default"]('Num', (_f = key.extra) === null || _f === void 0 ? void 0 : _f.raw, key.value), (0, location_1.toENRELocation)(key.loc), classEntity, {
                        /**
                         * In the case of a NumericLiteral, this will never be a constructor method.
                         */
                        kind: path.node.kind,
                        isStatic: path.node.static,
                        isGenerator: path.node.generator,
                        isAsync: path.node.async,
                        isAbstract: (_g = path.node.abstract) !== null && _g !== void 0 ? _g : false,
                        TSVisibility: (_h = path.node.accessibility) !== null && _h !== void 0 ? _h : (lang === 'ts' ? 'public' : undefined)
                    });
                    break;
                default:
                // WONT-FIX: Extract name from dynamic expressions.
            }
        }
        if (entity) {
            // The JSObjRepr of this method
            var objRepr = (0, literal_handler_1.createJSObjRepr)('obj');
            objRepr.callable.push({ entity: entity, returns: [] });
            entity.pointsTo.push(objRepr);
            // Set method's JSObjRepr as its belonging class entity's JSObjRepr's kv
            classEntity.pointsTo[0].kv[entity.name.codeName] = objRepr;
            // Set `callable` of its belonging class entity's JSObjRepr if this is a constructor
            if (entity.name.payload === 'constructor') {
                // TODO: Class constructor's return value?
                // [Return Overriding] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor#
                classEntity.pointsTo[0].callable.push({
                    entity: entity,
                    returns: [classEntity]
                });
            }
            scope.last().children.push(entity);
            scope.push(entity);
            (0, parameter_handler_1["default"])(path.node, scope, logs, onRecordField);
        }
    },
    exit: function (path, _a) {
        var scope = _a.scope;
        /**
         * Pop the last scope element ONLY IF a method entity is successfully created.
         */
        if (entity) {
            scope.pop();
            entity = undefined;
        }
    }
};
