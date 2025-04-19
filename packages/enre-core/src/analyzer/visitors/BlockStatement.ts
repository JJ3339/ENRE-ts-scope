/**
 * BlockStatement
 *
 * Extracted entities:
 *   * Block
 */
import {ENREContext} from '../context';
import {NodePath} from '@babel/traverse';
import {BlockStatement} from '@babel/types';
import {recordEntityBlock} from '@enre-ts/data';
import {toENRELocation} from '@enre-ts/location';
import { sGraph } from '@enre-ts/data';

type PathType = NodePath<BlockStatement>

/**
 * These parent types:
 *   * Span a declaration scope
 *   * The scope is presented as a block node
 *   * The scope is handled in their dedicated visitors
 */
const ignoreParentTypes = [
  'ArrowFunctionExpression',
  'ClassMethod',
  'FunctionDeclaration',
  'FunctionExpression',
  'ForOfStatement',
  'ForInStatement',
];

/**
 * The creation of block scope for certain kinds of AST nodes
 * is handled in their dedicated visitors, hence we should record
 * whether the corresponding block entity was created or not (to
 * correctly handle enter/exit event).
 *
 * This memo table uses block's `${startLine}:${startColumn}` as unique
 * map key, and the value is a boolean indicating whether a block entity
 * was created for that code point, so that while exiting this block node,
 * we can decide whether to pop the block entity from the scope stack.
 *
 * This table enables sharing information between enter/exit events,
 * and can correctly handle block nesting.
 */
const memoTable = new Map<string, boolean>();

export default {
  enter: (path: PathType, {file: {logs}, scope}: ENREContext) => {
    const memoKey = `${path.node.loc!.start.line}:${path.node.loc!.start.column}`;

    if (ignoreParentTypes.includes(path.parent.type)) {
      memoTable.set(memoKey, false);
    } else {
      memoTable.set(memoKey, true);
      const entity = recordEntityBlock(
        'any',
        toENRELocation(path.node.loc),
        scope.last(),
      );
      scope.last().children.push(entity);
      scope.push(entity);

      sGraph.add(entity);
    }
  },

  exit: (path: PathType, {scope}: ENREContext) => {
    const memoKey = `${path.node.loc!.start.line}:${path.node.loc!.start.column}`;

    if (memoTable.get(memoKey)) {
      scope.pop();
      memoTable.delete(memoKey);
    }
  },
};
