import {ENREEntityCollectionAll} from '../../entity/collections';
import {ENRELocation} from '@enre-ts/location';
import {addAbilityBase, ENRERelationAbilityBase} from '../ability/base';
import {recordRelation} from '../../utils/wrapper';

export interface ENRERelationUse extends ENRERelationAbilityBase {
  type: 'use',
}

export const createRelationUse = (
  from: ENREEntityCollectionAll,
  to: ENREEntityCollectionAll,
  location: ENRELocation,
): ENRERelationUse => {
  return {
    ...addAbilityBase(from, to, location),

    type: 'use',
  };
};

export const recordRelationUse = recordRelation(createRelationUse);
