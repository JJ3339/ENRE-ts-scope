/**
 * TSEnumMember
 *
 * Extracted entities:
 *   * Enum Member
 */

import {NodePath} from '@babel/traverse';
import {TSEnumMember} from '@babel/types';
import {
  ENREEntityEnum,
  ENREEntityEnumMember,
  id,
  recordEntityEnumMember
} from '@enre-ts/data';
import {toENRELocation} from '@enre-ts/location';
import ENREName from '@enre-ts/naming';
import {ENREContext} from '../context';
import {logger} from '@enre-ts/core';

type PathType = NodePath<TSEnumMember>

export default (path: PathType, {scope}: ENREContext) => {
  let entity: ENREEntityEnumMember | undefined = undefined;

  switch (path.node.id.type) {
    case 'Identifier':
      entity = recordEntityEnumMember(
        new ENREName('Norm', path.node.id.name),
        toENRELocation(path.node.id.loc),
        scope.last() as ENREEntityEnum,
        /* TODO: Enum member value evaluation */
        {},
      );
      break;
    case 'StringLiteral':
      if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(path.node.id.value)) {
        // Base 10 standard numeric string as enum member name is invalid
        logger.warn('Base10 standard numeric string literal can not be used as enum member name, this entity will be ignored.');
      } else {
        entity = recordEntityEnumMember(
          new ENREName('Str', path.node.id.value),
          toENRELocation(path.node.id.loc),
          scope.last() as ENREEntityEnum,
          {},
        );
      }
      break;
  }

  if (entity) {
    scope.last<ENREEntityEnum>().children.push(entity);
  }
};
