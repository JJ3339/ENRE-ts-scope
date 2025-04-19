import ArrowFunctionExpression from './ArrowFunctionExpression';
import AssignmentExpression from './AssignmentExpression';
import BlockStatement from './BlockStatement';
import CatchClause from './CatchClause';
import ClassDeclaration from './ClassDeclaration';
import ClassMethod from './ClassMethod';
import ClassProperty from './ClassProperty';
import ExportDefaultDeclaration from './ExportDefaultDeclaration';
import ExportNamedDeclaration from './ExportNamedDeclaration';
import ExpressionStatement from './ExpressionStatement';
import FunctionDeclaration from './FunctionDeclaration';
import ImportDeclaration from './ImportDeclaration';
import TSCallSignatureDeclaration from './TSCallSignatureDeclaration';
import TSConstructSignatureDeclaration from './TSConstructSignatureDeclaration';
import TSEnumDeclaration from './TSEnumDeclaration';
import TSEnumMember from './TSEnumMember';
import TSIndexSignature from './TSIndexSignature';
import TSInterfaceDeclaration from './TSInterfaceDeclaration';
import TSModuleDeclaration from './TSModuleDeclaration';
import TSPropertySignature from './TSPropertySignature';
import TSTypeAliasDeclaration from './TSTypeAliasDeclaration';
import TSTypeParameterDeclaration from './TSTypeParameterDeclaration';
import VariableDeclaration from './VariableDeclaration';
import Decorator from './Decorator';
import ExportAllDeclaration from './ExportAllDeclaration';
import TSTypeAnnotation from './TSTypeAnnotation';
import StaticBlock from './StaticBlock';
import TSExportAssignment from './TSExportAssignment';
import TSImportEqualsDeclaration from './TSImportEqualsDeclaration';
import ReturnStatement from './ReturnStatement';
import ThrowStatement from './ThrowStatement';

export default {
  'ArrowFunctionExpression': ArrowFunctionExpression,
  'AssignmentExpression': AssignmentExpression,
  'BlockStatement': BlockStatement,
  'CatchClause': CatchClause,
  'ClassDeclaration|ClassExpression': ClassDeclaration,
  'ClassMethod|ClassPrivateMethod': ClassMethod,
  'ClassProperty|ClassPrivateProperty': ClassProperty,
  'Decorator': Decorator,
  'ExportAllDeclaration': ExportAllDeclaration,
  'ExportDefaultDeclaration': ExportDefaultDeclaration,
  'ExportNamedDeclaration': ExportNamedDeclaration,
  'ExpressionStatement': ExpressionStatement,
  // FIXME: Disable this since block entity should not be visible as a relation's 'from' entity
  // 'ForOfStatement|ForInStatement': ForOfStatement,
  'FunctionDeclaration|FunctionExpression': FunctionDeclaration,
  'ImportDeclaration': ImportDeclaration,
  'ReturnStatement|YieldExpression': ReturnStatement,
  'StaticBlock': StaticBlock,
  'ThrowStatement': ThrowStatement,
  'TSCallSignatureDeclaration': TSCallSignatureDeclaration,
  'TSConstructSignatureDeclaration': TSConstructSignatureDeclaration,
  'TSEnumDeclaration': TSEnumDeclaration,
  'TSEnumMember': TSEnumMember,
  'TSExportAssignment': TSExportAssignment,
  'TSImportEqualsDeclaration': TSImportEqualsDeclaration,
  'TSIndexSignature': TSIndexSignature,
  'TSInterfaceDeclaration': TSInterfaceDeclaration,
  //'TSMethodSignature': TSMethodSignature,
  'TSModuleDeclaration': TSModuleDeclaration,
  'TSPropertySignature': TSPropertySignature,
  'TSTypeAliasDeclaration': TSTypeAliasDeclaration,
  'TSTypeAnnotation': TSTypeAnnotation,
  'TSTypeParameterDeclaration': TSTypeParameterDeclaration,
  //'UpdateExpression': UpdateExpression,
  'VariableDeclaration': VariableDeclaration,
};
