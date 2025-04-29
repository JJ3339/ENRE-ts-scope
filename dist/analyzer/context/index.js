"use strict";
exports.__esModule = true;
var scope_1 = require("./scope");
function default_1(file) {
    return {
        file: file,
        scope: new scope_1.ENREScope(file),
        modifiers: new Map()
    };
}
exports["default"] = default_1;
