"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.codeLogger = exports.logger = void 0;
var data_1 = require("@enre-ts/data");
var analyzer_1 = require("./analyzer");
var linker_1 = require("./analyzer/linker");
var fileUtils_1 = require("./utils/fileUtils");
var naming_1 = require("@enre-ts/naming");
var shared_1 = require("@enre-ts/shared");
var path_finder_1 = require("@enre-ts/path-finder");
exports.logger = (0, shared_1.createLogger)('core');
exports.codeLogger = (0, shared_1.createLogger)('code analysis');
exports["default"] = (function (inputPaths, exclude) {
    if (exclude === void 0) { exclude = undefined; }
    return __awaiter(void 0, void 0, void 0, function () {
        var files, pkgEntities, _loop_1, _i, files_1, file, _a, _b, f;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, path_finder_1["default"])(inputPaths, exclude)];
                case 1:
                    files = _d.sent();
                    /**
                     * PRE PASS: Create package and file entities to build structure hierarchy.
                     */
                    exports.logger.info('Starting pass 0: Project structure analysis');
                    pkgEntities = [];
                    _loop_1 = function (file) {
                        var pkg, _e, _f, e_1, pkgEntity, fileEntity;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    if (!(file.name === 'package.json')) return [3 /*break*/, 5];
                                    _g.label = 1;
                                case 1:
                                    _g.trys.push([1, 3, , 4]);
                                    _f = (_e = JSON).parse;
                                    return [4 /*yield*/, (0, fileUtils_1.getFileContent)(file.fullname)];
                                case 2:
                                    pkg = _f.apply(_e, [_g.sent()]);
                                    if (pkg.name) {
                                        pkgEntities.push((0, data_1.recordEntityPackage)(new naming_1["default"]('Pkg', pkg.name), file.dir.fullname, pkg));
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _g.sent();
                                    exports.logger.error("Failed to parse package.json at ".concat(file.fullname, ": ").concat(e_1.message));
                                    return [3 /*break*/, 4];
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    pkgEntity = pkgEntities.filter(function (p) { return file.fullname.includes(p.path); })
                                        // Sort by path length, so that the most inner package will be selected
                                        .sort(function (p1, p2) { return p2.path.length - p1.path.length; })[0];
                                    fileEntity = (0, data_1.recordEntityFile)(new naming_1["default"]('File', file.name), file.fullname, file.ext.includes('m') || file.ext.includes('t') ? 'module' : (((_c = pkgEntity === null || pkgEntity === void 0 ? void 0 : pkgEntity.pkgJson) === null || _c === void 0 ? void 0 : _c.type) === 'module' ? 'module' : 'script'), file.ext === 'json' ? 'json' : (file.ext.includes('ts') ? 'ts' : 'js'), file.ext.includes('x'), 
                                    // Find all packages whose path includes the file's path
                                    pkgEntity);
                                    pkgEntity === null || pkgEntity === void 0 ? void 0 : pkgEntity.children.push(fileEntity);
                                    _g.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, files_1 = files;
                    _d.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 5];
                    file = files_1[_i];
                    return [5 /*yield**/, _loop_1(file)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    /**
                     * FIRST PASS: Extract entities and immediate relations, build entity graph.
                     */
                    exports.logger.info('Starting pass 1: AST traversing, code entity extraction, and postponed task collecting');
                    _a = 0, _b = data_1.eGraph
                        .where({ type: 'file' })
                        .filter(function (f) { return f.lang !== 'json'; });
                    _d.label = 6;
                case 6:
                    if (!(_a < _b.length)) return [3 /*break*/, 9];
                    f = _b[_a];
                    return [4 /*yield*/, (0, analyzer_1.analyze)(f)];
                case 7:
                    _d.sent();
                    _d.label = 8;
                case 8:
                    _a++;
                    return [3 /*break*/, 6];
                case 9:
                    /**
                     * SECOND PASS: Work on pseudo relation container and postponed task container to link string into correlated entity object.
                     */
                    exports.logger.info('Starting pass 2: (Explicit/Implicit) Dependency resolving');
                    (0, linker_1["default"])();
                    return [2 /*return*/];
            }
        });
    });
});
