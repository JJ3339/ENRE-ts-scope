/**
 * TSImportEqualsDeclaration
 *
 * Extracted relations:
 *   * Import (Namespace)
 *   * Export (Namespace)
 */

import {NodePath} from '@babel/traverse';
import {TSImportEqualsDeclaration} from '@babel/types';
import {
  ENREEntityAlias,
  ENREEntityCollectionAll,
  ENREEntityCollectionInFile,
  ENREEntityCollectionScoping,
  ENREEntityFile,
  ENREEntityNamespace,
  ENREPseudoRelation,
  pseudoR,
  recordEntityAlias,
  recordEntityNamespace,
  SearchingGuidance,
  sGraph
} from '@enre-ts/data';
import moduleResolver from '../module-resolver';
import {toENRELocation} from '@enre-ts/location';
import ENREName from '@enre-ts/naming';
import {createRelationImport, ENRERelationImport} from 'packages/enre-data/src/relation/variant/import';
import {ENREContext} from '../context';

type PathType = NodePath<TSImportEqualsDeclaration>

export default {
  enter: (path: PathType, {scope}: ENREContext) => {
    // 当前作用域
    const currentScope = scope.last();

    // 检查当前作用域是否为文件作用域或命名空间作用域
    if (!['file', 'namespace'].includes(currentScope.type)) {
      return;
    }

    const symbolRole = path.node.importKind === 'type' ? 'type' : 'any';

    // 获取导入的别名
    const importAlias = path.node.id;
    const aliasName = importAlias.type === 'Identifier' ? importAlias.name : '';

    // 获取导入的目标
    const importedTarget = path.node.moduleReference;

    let resolvedModule: ENREEntityCollectionAll | undefined;
    let searchingGuidance: SearchingGuidance | undefined;

    // 检查导入的目标类型
    if (importedTarget.type === 'TSExternalModuleReference') {
      // 外部模块引用
      const moduleSpecifier = (importedTarget.expression as any).value;
      resolvedModule = moduleResolver(currentScope as ENREEntityFile, moduleSpecifier);
      if (resolvedModule) {
        searchingGuidance = {
          role: 'any',
          identifier: moduleSpecifier,
          at: resolvedModule as ENREEntityCollectionScoping,
        };
      }
    } else if (importedTarget.type === 'Identifier') {
      // 命名空间引用
      const namespaceName = importedTarget.name;
      resolvedModule = sGraph.where({
        type: 'namespace',
        name: namespaceName,
        parent: currentScope
      }).map(result => result.entity)[0];
      if (resolvedModule) {
        searchingGuidance = {
          role: 'any',
          identifier: namespaceName,
          at: currentScope
        };
      }
    }

    if (resolvedModule && searchingGuidance) {
      // 检查是否已有同名的别名实体
      let aliasEntity: ENREEntityAlias<ENRERelationImport> | undefined;
      for (const sibling of currentScope.children) {
        if (sibling.type === 'alias' && sibling.name.codeName === aliasName) {
          aliasEntity = sibling as ENREEntityAlias<ENRERelationImport>;
          break;
        }
      }

      if (!aliasEntity) {
        aliasEntity = recordEntityAlias(
          new ENREName('Norm', aliasName),
          toENRELocation(importAlias.loc),
          currentScope
        ) as ENREEntityAlias<ENRERelationImport>;

        (currentScope.children as ENREEntityCollectionInFile[]).push(aliasEntity);
      }

      const pseudoImportRelation: ENREPseudoRelation<ENRERelationImport, "to"> = {
        type: 'import',
        from: currentScope,
        to: searchingGuidance,
        location: toENRELocation(path.node.loc),
        sourceRange: toENRELocation(importedTarget.loc),
        kind: symbolRole,
        alias: aliasEntity,
      };

      pseudoR.add<ENRERelationImport>(pseudoImportRelation);

      scope.push(aliasEntity);
      sGraph.add(aliasEntity);
      sGraph.addModule(currentScope, aliasEntity as any);
    }
  },

  exit: (path: PathType, {scope}: ENREContext) => {
    scope.pop();
  }
};