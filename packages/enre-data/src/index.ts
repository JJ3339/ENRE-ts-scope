/**
 * ENRE entity container
 */
export {default as eGraph, ENREEntityPredicates} from './container/e';

/**
 * ENRE entities
 */
export {ENREEntityAbilityBase} from './entity/ability/base';

export {ENREEntityBlock, recordEntityBlock} from './entity/structure/block';
export {ENREEntityFile, recordEntityFile} from './entity/structure/file';
export {ENREEntityPackage, recordEntityPackage, recordThirdPartyEntityPackage} from './entity/structure/package';
export {ENREEntityUnknown, recordThirdPartyEntityUnknown} from './entity/structure/unknown';

export {ENREEntityAlias, recordEntityAlias} from './entity/variant/alias';
export {ENREEntityClass, recordEntityClass} from './entity/variant/class';
export {ENREEntityEnum, recordEntityEnum} from './entity/variant/enum';
export {ENREEntityEnumMember, recordEntityEnumMember} from './entity/variant/enum-member';
export {ENREEntityField, recordEntityField} from './entity/variant/field';
export {ENREEntityFunction, recordEntityFunction} from './entity/variant/function';
export {ENREEntityInterface, recordEntityInterface} from './entity/variant/interface';
export {ENREEntityMethod, recordEntityMethod} from './entity/variant/method';
export {ENREEntityNamespace, recordEntityNamespace} from './entity/variant/namespace';
export {ENREEntityParameter, recordEntityParameter} from './entity/variant/parameter';
export {ENREEntityProperty, recordEntityProperty} from './entity/variant/property';
export {ENREEntityTypeAlias, recordEntityTypeAlias} from './entity/variant/type-alias';
export {ENREEntityTypeParameter, recordEntityTypeParameter} from './entity/variant/type-parameter';
export {ENREEntityVariable, recordEntityVariable} from './entity/variant/variable';

/**
 * ENRE entity collections
 */
export * from './entity/collections';

/**
 * ENRE scope container
 */
export {default as sGraph, ENREScopePredicates} from './container/s';


/**
 * ENRE relation container
 */
export {default as rGraph, ENRERelationPredicates} from './container/r';
export {default as pseudoR, ENREPseudoRelation} from './container/pseudoR';

/**
 * ENRE relations
 */
export {ENRERelationAbilityBase} from './relation/ability/base';

export {ENRERelationCall, recordRelationCall} from './relation/variant/call';
export {ENRERelationDecorate, recordRelationDecorate} from './relation/variant/decorate';
export {ENRERelationExport, recordRelationExport} from './relation/variant/export';
export {ENRERelationExtend, recordRelationExtend} from './relation/variant/extend';
export {ENRERelationImplement, recordRelationImplement} from './relation/variant/implement';
export {ENRERelationImport, recordRelationImport} from './relation/variant/import';
export {ENRERelationModify, recordRelationModify} from './relation/variant/modify';
export {ENRERelationOverride, recordRelationOverride} from './relation/variant/override';
export {ENRERelationSet, recordRelationSet} from './relation/variant/set';
export {ENRERelationType, recordRelationType} from './relation/variant/type';
export {ENRERelationUse, recordRelationUse} from './relation/variant/use';

/**
 * ENRE relation collections
 */
export * from './relation/collections';

export {SearchingGuidance} from './container/pseudoR';

/**
 * ENRE postponed task container
 */

export {default as postponedTask} from './container/postponedTask';

export const valueEntityTypes = ['unknown', 'file', 'variable', 'function', 'parameter', 'class', 'field', 'method', 'property', 'alias', 'namespace', 'enum', 'enum member'] as const;
export const typeEntityTypes = ['unknown', 'alias', 'class', 'property', 'namespace', 'type alias', 'enum', 'enum member', 'interface', 'type parameter'] as const;

export {ENRELogEntry} from './log/log-entry';
export {id} from './utils/wrapper';
export {default as release} from './utils/release';
export {default as clear} from './utils/clear';
