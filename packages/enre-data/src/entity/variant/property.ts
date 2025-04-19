import {ENRELocation} from '@enre-ts/location';
import ENREName from '@enre-ts/naming';
import {addAbilityBase, ENREEntityAbilityBase} from '../ability/base';
import {ENREEntityCollectionAll} from '../collections';
import {recordEntity} from '../../utils/wrapper';

export interface ENREEntityProperty extends ENREEntityAbilityBase {
  type: 'property';
  // signature: 'property' | 'call' | 'constructor' | 'method';
}

export const createEntityProperty = (
  name: ENREName<any>,
  location: ENRELocation,
  parent: ENREEntityCollectionAll,
  // {
  //   signature = 'property',
  // }: Partial<Pick<ENREEntityProperty, 'signature'>>
): ENREEntityProperty => {
  return {
    ...addAbilityBase(name, location, parent),

    get type() {
      return 'property' as const;
    },

    // get signature() {
    //   return signature;
    // },
  };
};

export const recordEntityProperty = recordEntity(createEntityProperty);
