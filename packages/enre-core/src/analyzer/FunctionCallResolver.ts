import {
  ENREEntityCollectionAll,
  ENREEntityCollectionScoping,
  sGraph,
} from "@enre-ts/data";
import { ENRELocation } from "@enre-ts/location";
import lookup from "./linker/lookup";
import {
  createRelationCall,
  recordRelationCall,
} from "packages/enre-data/src/relation/variant/call";

// 定义查找函数定义的辅助函数
export function findFunctionDefinition(
  scope: ENREEntityCollectionScoping,
  calleeName: string,
  visited = new Set<ENREEntityCollectionScoping>()
): ENREEntityCollectionAll | null {
  // 防止循环引用导致的无限递归
  if (visited.has(scope)) {
    return null;
  }
  visited.add(scope);

  // 使用lookup函数查找函数定义
  const callee = lookup({
    role: "value",
    identifier: calleeName,
    at: scope,
    localOnly: false,
    exportsOnly: false,
  });

  if (Array.isArray(callee)) {
    // 如果返回的是数组，取第一个元素
    return callee.length > 0 ? callee[0] : null;
  }

  if (callee) {
    return callee;
  }

  // 如果当前作用域没有找到，递归查找父作用域
  if (scope.parent) {
    const parentNode = sGraph.allNodes.find((node) => node.entity === scope.parent);
    if (parentNode) {
      return findFunctionDefinition(
        parentNode.entity as ENREEntityCollectionScoping,
        calleeName,
        visited
      );
    }
  }

  return null;
}

export function resolveFunctionCall(
  caller: ENREEntityCollectionAll,
  calleeName: string,
  location: ENRELocation
): boolean {
  let callerScope: ENREEntityCollectionScoping;
  if (caller.type === "function") {
    callerScope = caller.parent as ENREEntityCollectionScoping;
  } else if (caller.type === "class" || caller.type === "interface") {
    callerScope = caller.parent as ENREEntityCollectionScoping;
  } else {
    // 如果调用者不是函数或类，返回 false
    return false;
  }
  if (caller.parent) {
    callerScope = caller.parent as ENREEntityCollectionScoping;
  } else {
    // 如果调用者没有父作用域，使用全局作用域
    const globalScope = sGraph.allNodes[0];
    if (globalScope) {
      callerScope = globalScope.entity as ENREEntityCollectionScoping;
    } else {
      return false;
    }
  }
  const callee = findFunctionDefinition(callerScope, calleeName);

  if (callee) {
    // 记录调用关系
    recordRelationCall(caller, callee, location, { isNew: false });
    return true;
  }

  return false;
}
