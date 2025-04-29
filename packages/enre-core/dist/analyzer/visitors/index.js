"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrowFunctionExpression_1 = require("./ArrowFunctionExpression");
var AssignmentExpression_1 = require("./AssignmentExpression");
var BlockStatement_1 = require("./BlockStatement");
var CatchClause_1 = require("./CatchClause");
var ClassDeclaration_1 = require("./ClassDeclaration");
var ClassMethod_1 = require("./ClassMethod");
var ClassProperty_1 = require("./ClassProperty");
var ExportDefaultDeclaration_1 = require("./ExportDefaultDeclaration");
var ExportNamedDeclaration_1 = require("./ExportNamedDeclaration");
var ExpressionStatement_1 = require("./ExpressionStatement");
var FunctionDeclaration_1 = require("./FunctionDeclaration");
var ImportDeclaration_1 = require("./ImportDeclaration");
var TSCallSignatureDeclaration_1 = require("./TSCallSignatureDeclaration");
var TSConstructSignatureDeclaration_1 = require("./TSConstructSignatureDeclaration");
var TSEnumDeclaration_1 = require("./TSEnumDeclaration");
var TSEnumMember_1 = require("./TSEnumMember");
var TSIndexSignature_1 = require("./TSIndexSignature");
var TSInterfaceDeclaration_1 = require("./TSInterfaceDeclaration");
var TSModuleDeclaration_1 = require("./TSModuleDeclaration");
var TSPropertySignature_1 = require("./TSPropertySignature");
var TSTypeAliasDeclaration_1 = require("./TSTypeAliasDeclaration");
var TSTypeParameterDeclaration_1 = require("./TSTypeParameterDeclaration");
var VariableDeclaration_1 = require("./VariableDeclaration");
var Decorator_1 = require("./Decorator");
var ExportAllDeclaration_1 = require("./ExportAllDeclaration");
var TSTypeAnnotation_1 = require("./TSTypeAnnotation");
var StaticBlock_1 = require("./StaticBlock");
var TSExportAssignment_1 = require("./TSExportAssignment");
var TSImportEqualsDeclaration_1 = require("./TSImportEqualsDeclaration");
var ReturnStatement_1 = require("./ReturnStatement");
var ThrowStatement_1 = require("./ThrowStatement");
exports.default = {
    'ArrowFunctionExpression': ArrowFunctionExpression_1.default,
    'AssignmentExpression': AssignmentExpression_1.default,
    'BlockStatement': BlockStatement_1.default,
    'CatchClause': CatchClause_1.default,
    'ClassDeclaration|ClassExpression': ClassDeclaration_1.default,
    'ClassMethod|ClassPrivateMethod': ClassMethod_1.default,
    'ClassProperty|ClassPrivateProperty': ClassProperty_1.default,
    'Decorator': Decorator_1.default,
    'ExportAllDeclaration': ExportAllDeclaration_1.default,
    'ExportDefaultDeclaration': ExportDefaultDeclaration_1.default,
    'ExportNamedDeclaration': ExportNamedDeclaration_1.default,
    'ExpressionStatement': ExpressionStatement_1.default,
    // FIXME: Disable this since block entity should not be visible as a relation's 'from' entity
    // 'ForOfStatement|ForInStatement': ForOfStatement,
    'FunctionDeclaration|FunctionExpression': FunctionDeclaration_1.default,
    'ImportDeclaration': ImportDeclaration_1.default,
    'ReturnStatement|YieldExpression': ReturnStatement_1.default,
    'StaticBlock': StaticBlock_1.default,
    'ThrowStatement': ThrowStatement_1.default,
    'TSCallSignatureDeclaration': TSCallSignatureDeclaration_1.default,
    'TSConstructSignatureDeclaration': TSConstructSignatureDeclaration_1.default,
    'TSEnumDeclaration': TSEnumDeclaration_1.default,
    'TSEnumMember': TSEnumMember_1.default,
    'TSExportAssignment': TSExportAssignment_1.default,
    'TSImportEqualsDeclaration': TSImportEqualsDeclaration_1.default,
    'TSIndexSignature': TSIndexSignature_1.default,
    'TSInterfaceDeclaration': TSInterfaceDeclaration_1.default,
    //'TSMethodSignature': TSMethodSignature,
    'TSModuleDeclaration': TSModuleDeclaration_1.default,
    'TSPropertySignature': TSPropertySignature_1.default,
    'TSTypeAliasDeclaration': TSTypeAliasDeclaration_1.default,
    'TSTypeAnnotation': TSTypeAnnotation_1.default,
    'TSTypeParameterDeclaration': TSTypeParameterDeclaration_1.default,
    //'UpdateExpression': UpdateExpression,
    'VariableDeclaration': VariableDeclaration_1.default,
};
