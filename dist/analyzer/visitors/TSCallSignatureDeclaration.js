"use strict";
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var naming_1 = require("@enre-ts/naming");
exports["default"] = (function (path, _a) {
    var scope = _a.scope;
    var entity = (0, data_1.recordEntityProperty)(new naming_1["default"]('Sig', 'Callable'), (0, location_1.toENRELocation)(path.node.loc), scope.last());
    scope.last().children.push(entity);
});
