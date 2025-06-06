import {
  ENREEntityCollectionAll,
  ENREEntityCollectionScoping,
  ENREEntityFunction,
  sGraph,
} from "@enre-ts/data";
import { ENRELocation } from "@enre-ts/location";
import lookup from "./linker/lookup";
import { recordRelationCall } from "@enre-ts/data";

// 定义查找函数定义的辅助函数
export function findFunctionDefinitionLookUp(
  scope: ENREEntityCollectionScoping,
  calleeName: string,
  visited = new Set<ENREEntityCollectionScoping>()
): { callee: ENREEntityCollectionAll | null; scopeName: string | undefined } {
  // 防止循环引用导致的无限递归
  if (visited.has(scope)) {
    return {callee: null, scopeName: undefined};
  }
  visited.add(scope);

  let foundScopeName: string | undefined = undefined;
  const onFoundScopeName = (scopeName: string | undefined) => {
    foundScopeName = scopeName;
  };

  // 使用lookup函数查找函数定义
  const callee = lookup({
    role: "value",
    identifier: calleeName,
    at: scope,
    localOnly: false,
    exportsOnly: false,
  }, false, onFoundScopeName);

  if (Array.isArray(callee)) {
    // 如果返回的是数组，取第一个元素
    if (callee.length > 0) {
      return { callee: callee[0], scopeName: foundScopeName };
    }
    else{
      return { callee: null, scopeName: undefined };  

    }
  }

  if (callee) {
    return { callee, scopeName: foundScopeName };
  }

  return {callee: null, scopeName: undefined};
}




export function resolveFunctionCallLookUp(
  caller: ENREEntityCollectionAll,
  calleeName: string,
  location: ENRELocation
): { resolved: boolean; scopeName: string | undefined } {
  let callerScope: ENREEntityCollectionScoping;

  if (caller.type === "function" || caller.type === "file") {
    callerScope = caller as ENREEntityCollectionScoping;
  } else if (caller.type === "class" || caller.type === "interface") {
    callerScope = caller as ENREEntityCollectionScoping;
  } else {
    // 如果调用者不是函数或类，返回 false
    return {resolved: false, scopeName: undefined};
  }

  const {callee, scopeName} = findFunctionDefinitionLookUp(callerScope, calleeName);

  if (callee) {
    // 记录调用关系
    recordRelationCall(caller, callee, location, { isNew: false });
    //添加函数调用关系到图中
    sGraph.addFunctionCall(callerScope, callee as ENREEntityFunction);
    return { resolved: true, scopeName };
  }

  return { resolved: false, scopeName };
}
