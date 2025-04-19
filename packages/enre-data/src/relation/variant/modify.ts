import {ENREEntityCollectionAll} from '../../entity/collections';
import {ENRELocation} from '@enre-ts/location';
import {addAbilityBase, ENRERelationAbilityBase} from '../ability/base';
import {recordRelation} from '../../utils/wrapper';

export interface ENRERelationModify extends ENRERelationAbilityBase {
  type: 'modify',
}

export const createRelationModify = (
  from: ENREEntityCollectionAll,
  to: ENREEntityCollectionAll,
  location: ENRELocation,
) => {
  return {
    ...addAbilityBase(from, to, location),

    type: 'modify',
  };
};

export const recordRelationModify = recordRelation(createRelationModify);
