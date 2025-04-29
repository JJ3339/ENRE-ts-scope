"use strict";
/**
 * TSPropertySignature
 *
 * Extracted entities:
 *   * Property
 */
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
exports.default = (function (path, _a) {
    var _b;
    var scope = _a.scope;
    var entity = undefined;
    switch (path.node.key.type) {
        case 'Identifier':
            entity = (0, data_1.recordEntityProperty)(new naming_1.default('Norm', path.node.key.name), (0, location_1.toENRELocation)(path.node.key.loc), scope.last());
            break;
        // TODO: If a string literal has the same content as a numeric literal, an warning should raise
        case 'StringLiteral':
            entity = (0, data_1.recordEntityProperty)(new naming_1.default('Str', path.node.key.value), (0, location_1.toENRELocation)(path.node.key.loc), scope.last());
            break;
        case 'NumericLiteral':
            entity = (0, data_1.recordEntityProperty)(new naming_1.default('Num', (_b = path.node.key.extra) === null || _b === void 0 ? void 0 : _b.raw, path.node.key.value), (0, location_1.toENRELocation)(path.node.key.loc), scope.last());
            break;
        default:
        // WONT-FIX: Extract name from other expressions
    }
    if (entity) {
        scope.last().children.push(entity);
    }
});
