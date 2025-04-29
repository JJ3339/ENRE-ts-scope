"use strict";
/**
 * TSEnumMember
 *
 * Extracted entities:
 *   * Enum Member
 */
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
var core_1 = require("@enre-ts/core");
exports.default = (function (path, _a) {
    var scope = _a.scope;
    var entity = undefined;
    switch (path.node.id.type) {
        case 'Identifier':
            entity = (0, data_1.recordEntityEnumMember)(new naming_1.default('Norm', path.node.id.name), (0, location_1.toENRELocation)(path.node.id.loc), scope.last(), 
            /* TODO: Enum member value evaluation */
            {});
            break;
        case 'StringLiteral':
            if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(path.node.id.value)) {
                // Base 10 standard numeric string as enum member name is invalid
                core_1.logger.warn('Base10 standard numeric string literal can not be used as enum member name, this entity will be ignored.');
            }
            else {
                entity = (0, data_1.recordEntityEnumMember)(new naming_1.default('Str', path.node.id.value), (0, location_1.toENRELocation)(path.node.id.loc), scope.last(), {});
            }
            break;
    }
    if (entity) {
        scope.last().children.push(entity);
    }
});
