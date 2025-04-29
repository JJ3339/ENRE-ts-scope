"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
exports.default = (function (path, _a) {
    var scope = _a.scope;
    var entity = undefined;
    var type = path.node.parameters[0].typeAnnotation.typeAnnotation.type;
    if (type === 'TSNumberKeyword') {
        entity = (0, data_1.recordEntityProperty)(new naming_1.default('Sig', 'NumberIndex'), (0, location_1.toENRELocation)(path.node.loc), scope.last());
    }
    else if (type === 'TSStringKeyword') {
        entity = (0, data_1.recordEntityProperty)(new naming_1.default('Sig', 'StringIndex'), (0, location_1.toENRELocation)(path.node.loc), scope.last());
    }
    else {
        // TODO: Warning
    }
    if (entity) {
        scope.last().children.push(entity);
    }
});
