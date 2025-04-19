import {ENRELocation} from '@enre-ts/location';
import ENREName from '@enre-ts/naming';
import {addAbilityBase, ENREEntityAbilityBase} from '../ability/base';
import {ENREEntityCollectionAll} from '../collections';
import {addAbilityCallable, ENREEntityAbilityCallable} from '../ability/callable';
import {recordEntity} from '../../utils/wrapper';

export interface ENREEntityFunction extends ENREEntityAbilityBase, ENREEntityAbilityCallable {
  type: 'function',
  // Arrow functions capture current `this`, we need this to determine reference to `this`.
  isArrowFunction: boolean,
}

export const createEntityFunction = (
  name: ENREName<any>,
  location: ENRELocation,
  parent: ENREEntityCollectionAll,
  {
    isArrowFunction = false,
    isAsync = false,
    isGenerator = false,
  },
): ENREEntityFunction => {
  return {
    ...addAbilityBase(name, location, parent),

    ...addAbilityCallable(isAsync, isGenerator),

    type: 'function',

    isArrowFunction,
  };
};

export const recordEntityFunction = recordEntity(createEntityFunction);
