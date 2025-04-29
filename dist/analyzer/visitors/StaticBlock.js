"use strict";
/**
 * StaticBlock
 *
 * Extracted entities:
 *   * Block (Class static block)
 */
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
exports["default"] = {
    enter: function (path, _a) {
        var logs = _a.file.logs, scope = _a.scope;
        var entity = (0, data_1.recordEntityBlock)('class-static-block', 
        /**
         *        V Expected start column
         * static {
         * ^
         * @babel/parser's start column
         *
         * FIXME: Start column of class static block is not correct
         */
        (0, location_1.toENRELocation)(path.node.loc), scope.last());
        scope.last().children.push(entity);
        scope.push(entity);
        data_1.sGraph.add(entity);
    },
    exit: function (path, _a) {
        var scope = _a.scope;
        scope.pop();
    }
};
