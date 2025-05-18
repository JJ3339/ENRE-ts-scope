/**
 * VariableDeclaration
 *
 * Extracted entities:
 *   * Variable
 *
 * Extracted relations:
 *   * Set @init=true
 */

import {NodePath} from '@babel/traverse';
import {ForOfStatement, VariableDeclaration} from '@babel/types';
import {
  ENREEntityCollectionAnyChildren,
  ENREEntityVariable,
  postponedTask,
  recordEntityVariable,
  recordRelationSet,
  sGraph,
} from '@enre-ts/data';
import {ENRELocation} from '@enre-ts/location';
import {ENREContext} from '../context';
import traverseBindingPattern from './common/binding-pattern-handler';
import ENREName from '@enre-ts/naming';
import {variableKind} from '@enre-ts/shared';
import resolveJSObj, {JSMechanism} from './common/literal-handler';
import expressionHandler, {
  AscendPostponedTask,
  DescendPostponedTask
} from './common/expression-handler';
import { findVariableDefinitionLookUp } from '../VariableCallResolverLookUp';

const buildOnRecord = (kind: variableKind, hasInit: boolean, initValue?: any) => {
  return (name: string, location: ENRELocation, scope: ENREContext['scope']) => {
    const entity = recordEntityVariable(
      new ENREName('Norm', name),
      location,
      scope.last(),
      {kind},
    );

    // 添加变量值
    if (hasInit && initValue) {
      (entity as any).value = initValue;
    }

    scope.last<ENREEntityCollectionAnyChildren>().children.push(entity);
    // 创建带有 declared 状态的变量节点并添加到 sGraph.Variables
    const declaredVariable = { ...entity, callType: 'declared' };
    sGraph.addVariable(scope.last(), declaredVariable as ENREEntityVariable);

    if (hasInit) {
      // Record relation `set`
      recordRelationSet(
        scope.last(),
        entity,
        location,
        {isInit: true},
      );
    }

    return entity;
  };
};

// 递归处理表达式，标记引用的变量
const processNode = (node: any, scope: ENREContext['scope']) => {
  if (node.type === 'Identifier') {
    const variableName = node.name;
    const currentScope = scope.last();

    // 查找变量定义
    const { variable } = findVariableDefinitionLookUp(currentScope, variableName);
    console.log(variable?.name.codeName + '被引用了');

    if (variable) {
      // 创建带有 referenced 状态的变量节点并添加到 sGraph.Variables
      const referencedVariable = { ...variable, callType: 'referenced' };
      sGraph.addVariable(currentScope, referencedVariable as ENREEntityVariable);
    }
  } else if (node.type === 'BinaryExpression') {
    processNode(node.left, scope);
    processNode(node.right, scope);
  }
};

type PathType = NodePath<VariableDeclaration>

export default {
  enter: (path: PathType, {scope, modifiers}: ENREContext) => {
    const kind = path.node.kind;
    for (const declarator of path.node.declarations) {
      let objRepr: JSMechanism | DescendPostponedTask | undefined = resolveJSObj(declarator.init);
      // The init value is not a literal, but an expression.
      if (declarator.init && !objRepr) {
        objRepr = expressionHandler(declarator.init, scope);
      }

      // ForStatement is not supported due to the complexity of the AST structure.
      if (['ForOfStatement', 'ForInStatement'].includes(path.parent.type)) {
        objRepr = resolveJSObj((path.parent as ForOfStatement).right);
      }

      let initValue: any;
      if (objRepr && 'value' in objRepr) {
        initValue = objRepr.value;
      }

      const returned = traverseBindingPattern<ENREEntityVariable>(
        declarator.id,
        scope,
        undefined,
        buildOnRecord(kind as variableKind, !!objRepr, initValue),
      );

      if (returned && objRepr) {
        let variant: 'for-of' | 'for-await-of' | 'for-in' | undefined = undefined;
        if (path.parent.type === 'ForOfStatement') {
          variant = 'for-of';
          if (path.parent.await) {
            variant = 'for-await-of';
          }
        } else if (path.parent.type === 'ForInStatement') {
          variant = 'for-in';
        }

        if (objRepr.type === 'descend') {
          objRepr.onFinish = (resolvedResult) => {
            if (resolvedResult.length >= 1) {
              postponedTask.add({
                type: 'ascend',
                payload: [{
                  operation: 'assign',
                  operand0: returned,
                  // FIXME: Temporary only pass one resolved element, but it should be an array.
                  operand1: resolvedResult[0],
                  variant,
                }]
              } as AscendPostponedTask);

              return true;
            } else {
              return false;
            }
          };
        } else {
          postponedTask.add({
            type: 'ascend',
            payload: [{
              operation: 'assign',
              operand0: returned,
              operand1: objRepr,
              variant,
            }],
            scope: scope.last(),
          } as AscendPostponedTask);
        }
      }

      // 递归处理表达式右侧的变量
      if (declarator.init) {
        processNode(declarator.init, scope);
      }

      /**
       * Setup to extract properties from object literals,
       * which expects id to be an identifier.
       *
       * (BindingPattern will be supported by hidden dependency extraction.)
       */
      // if (declarator.id.type === 'Identifier') {
      //   if (declarator.init?.type === 'ObjectExpression') {
      //     if (returned) {
      //       scope.push(returned);
      //
      //       const key = `${path.node.loc!.start.line}:${path.node.loc!.start.column}`;
      //       modifiers.set(key, ({
      //         type: ModifierType.acceptProperty,
      //         proposer: returned,
      //       }));
      //     }
      //   }
      // }
    }
  },

  exit: (path: PathType, {modifiers}: ENREContext) => {
    // if (path.node.declarator.id.type === 'Identifier') {
    //   if (declarator.init?.type === 'ObjectExpression') {
    //   }
    // }
    // const key = `${path.node.loc!.start.line}:${path.node.loc!.start.column}`;
    // modifiers.delete(key);
  }
};