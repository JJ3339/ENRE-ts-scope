import {
  ENREEntityCollectionAll,
  ENREEntityCollectionScoping,
  ENREEntityVariable,
  sGraph,
} from "@enre-ts/data";
import { ENRELocation } from "@enre-ts/location";
import lookup from "./linker/lookup";
import { recordRelationCall } from "@enre-ts/data";

// 定义查找变量定义的辅助函数
export function findVariableDefinitionLookUp(
  scope: ENREEntityCollectionScoping,
  variableName: string,
  visited = new Set<ENREEntityCollectionScoping>()
): { variable: ENREEntityCollectionAll | null; scopeName: string | undefined } {
  // 防止循环引用导致的无限递归
  if (visited.has(scope)) {
    return { variable: null, scopeName: undefined };
  }
  visited.add(scope);

  let foundScopeName: string | undefined = undefined;
  const onFoundScopeName = (scopeName: string | undefined) => {
    foundScopeName = scopeName;
  };

  // 使用lookup函数查找变量定义
  const variable = lookup({
    role: "value",
    identifier: variableName,
    at: scope,
    localOnly: false,
    exportsOnly: false,
  }, false, onFoundScopeName);

  if (Array.isArray(variable)) {
    // 如果返回的是数组，取第一个元素
    if (variable.length > 0) {
      return { variable: variable[0], scopeName: foundScopeName };
    } else {
      return { variable: null, scopeName: undefined };
    }
  }

  if (variable) {
    return { variable, scopeName: foundScopeName };
  }

  return { variable: null, scopeName: undefined };
}

export function resolveVariableCallLookUp(
  caller: ENREEntityCollectionAll,
  variableName: string,
  location: ENRELocation
): { resolved: boolean; scopeName: string | undefined } {
  let callerScope: ENREEntityCollectionScoping;

  if (caller.type === "function" || caller.type === "file") {
    callerScope = caller as ENREEntityCollectionScoping;
  } else if (caller.type === "class" || caller.type === "interface") {
    callerScope = caller as ENREEntityCollectionScoping;
  } else {
    // 如果调用者不是函数或类，返回 false
    return { resolved: false, scopeName: undefined };
  }

  const { variable, scopeName } = findVariableDefinitionLookUp(callerScope, variableName);

  if (variable) {
    // 记录调用关系（这里将变量使用当作一种调用关系）
    recordRelationCall(caller, variable, location, { isNew: false });
    // 例如，假设存在 sGraph.addVariableUse 方法
    // sGraph.addVariableUse(callerScope, variable as ENREEntityVariable);
    return { resolved: true, scopeName };
  }

  return { resolved: false, scopeName };
}