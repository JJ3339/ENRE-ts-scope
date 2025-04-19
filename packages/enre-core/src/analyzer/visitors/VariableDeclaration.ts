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

const buildOnRecord = (kind: variableKind, hasInit: boolean) => {
  return (name: string, location: ENRELocation, scope: ENREContext['scope']) => {
    const entity = recordEntityVariable(
      new ENREName('Norm', name),
      location,
      scope.last(),
      {kind},
    );

    scope.last<ENREEntityCollectionAnyChildren>().children.push(entity);

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

      const returned = traverseBindingPattern<ENREEntityVariable>(
        declarator.id,
        scope,
        undefined,
        buildOnRecord(kind as variableKind, !!objRepr),
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
