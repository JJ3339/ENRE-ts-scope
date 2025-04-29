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
exports.visualizeScopeGraph = exports.analyze = void 0;
var d3 = require("d3");
var parser_1 = require("@babel/parser");
var traverse_1 = require("@babel/traverse");
var data_1 = require("@enre-ts/data");
var fileUtils_1 = require("../utils/fileUtils");
var context_1 = require("./context");
var modifier_1 = require("./context/modifier");
var visitors_1 = require("./visitors");
var index_1 = require("../index");
var data_2 = require("@enre-ts/data"); // 引入 sGraph 和 ENREScopePredicates
/**
 * Read, parse and analyze a single file.
 */
var analyze = function (fileEntity) { return __awaiter(void 0, void 0, void 0, function () {
    var content, ast, plugins, context;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                index_1.logger.verbose("Processing file: ".concat(fileEntity.path));
                return [4 /*yield*/, (0, fileUtils_1.getFileContent)(fileEntity.path)];
            case 1:
                content = _a.sent();
                try {
                    plugins = ['decorators'];
                    fileEntity.lang === 'ts' ? plugins.push('typescript') : undefined;
                    fileEntity.isJsx ? plugins.push('jsx') : undefined;
                    ast = (0, parser_1.parse)(content, {
                        // This seems to be a parser bug, which only affects the first line
                        // startColumn: 1,
                        sourceType: fileEntity.sourceType,
                        // @ts-ignore
                        plugins: plugins,
                        /**
                         * Enabling error recovery suppresses some TS errors
                         * and make it possible to deal with in user space.
                         */
                        errorRecovery: true
                    });
                }
                catch (_b) {
                    index_1.logger.error("Failed to parse the file ".concat(fileEntity.getQualifiedName()));
                }
                if (ast) {
                    context = (0, context_1["default"])(fileEntity);
                    data_1.eGraph.onAdd = (0, modifier_1.createModifierHandler)(context);
                    if (process.env.NODE_ENV === 'test') {
                        (0, traverse_1["default"])(ast, visitors_1["default"], undefined, context);
                    }
                    else {
                        // @ts-ignore
                        traverse_1["default"]["default"](ast, visitors_1["default"], undefined, context);
                    }
                }
                // 可视化作用域图
                visualizeScopeGraph(data_2.sGraph);
                return [2 /*return*/];
        }
    });
}); };
exports.analyze = analyze;
function visualizeScopeGraph(scopeContainer) {
    // 生成节点时强制初始化 x/y
    var nodes = scopeContainer.allNodes.map(function (node) { return ({
        id: node.entity.id,
        name: node.entity.name.codeName,
        type: node.entity.type,
        x: Math.random() * 800,
        y: Math.random() * 600
    }); });
    // 生成链接时直接引用节点对象
    var links = scopeContainer.allEdges.map(function (edge) {
        var sourceNode = nodes.find(function (n) { return n.id === edge.from.entity.id; });
        var targetNode = nodes.find(function (n) { return n.id === edge.to.entity.id; });
        return {
            source: sourceNode,
            target: targetNode,
            value: 2
        };
    });
    var width = 800;
    var height = 600;
    var svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    // 强制指定仿真节点的泛型类型
    var simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links)
        .distance(100))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2));
    // 渲染链接
    var link = svg.append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', function (d) { return Math.sqrt(d.value); });
    // 渲染节点
    var node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 5);
    // 在 tick 事件中直接访问节点属性
    simulation.on('tick', function () {
        link
            .attr('x1', function (d) { return d.source.x; })
            .attr('y1', function (d) { return d.source.y; })
            .attr('x2', function (d) { return d.target.x; })
            .attr('y2', function (d) { return d.target.y; });
        node
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; });
    });
}
exports.visualizeScopeGraph = visualizeScopeGraph;
