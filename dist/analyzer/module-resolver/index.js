"use strict";
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var shared_1 = require("@enre-ts/shared");
var path_1 = require("path");
var naming_1 = require("@enre-ts/naming");
exports["default"] = (function (currFile, specifier) {
    // Relative path
    if (specifier.startsWith('.')) {
        var extname = path_1["default"].extname(specifier);
        // No extension name provided, we have to try several options
        if (extname === '') {
            for (var _i = 0, supportedFileExt_1 = shared_1.supportedFileExt; _i < supportedFileExt_1.length; _i++) {
                var tryExt = supportedFileExt_1[_i];
                var fetched = data_1.eGraph.where({
                    type: 'file',
                    fullname: "<File ".concat(path_1["default"].resolve(path_1["default"].dirname(currFile.path), specifier + tryExt), ">")
                });
                if (fetched.length === 1) {
                    return fetched[0];
                }
            }
        }
        else {
            var fetched = data_1.eGraph.where({
                type: 'file',
                fullname: "<File ".concat(path_1["default"].resolve(path_1["default"].dirname(currFile.path), specifier), ">")
            });
            if (fetched.length === 1) {
                return fetched[0];
            }
        }
    }
    /**
     * Subpath imports
     * TODO: Handle subpath imports after package.json is resolved.
     * @see https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#subpath-imports
     */
    else if (specifier.startsWith('#')) {
        return;
    }
    // Built-in modules OR third-party modules
    else {
        // TODO: Built-in modules
        if (['', /* Node.js built-in modules */].includes(specifier)) {
            return;
        }
        else {
            /**
             * For third-party packages, only one entity will be created across multiple files.
             */
            var previouslyCreated = data_1.eGraph.where({
                type: 'package',
                name: specifier
            });
            if (previouslyCreated.length === 1) {
                return previouslyCreated[0];
            }
            else if (previouslyCreated.length === 0) {
                return (0, data_1.recordThirdPartyEntityPackage)(new naming_1["default"]('Norm', specifier));
            }
            else {
                // ???
            }
        }
    }
});
