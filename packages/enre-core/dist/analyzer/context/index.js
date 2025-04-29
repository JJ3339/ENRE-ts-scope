"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
var scope_1 = require("./scope");
function default_1(file) {
    return {
        file: file,
        scope: new scope_1.ENREScope(file),
        modifiers: new Map(),
    };
}
