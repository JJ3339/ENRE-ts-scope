import { ENREEntityCollectionAll, ENREEntityCollectionScoping, sGraph } from "@enre-ts/data";

export function findFunctionDefinitionDFS(
  scope: ENREEntityCollectionScoping,
  calleeName: string
): { callee: ENREEntityCollectionAll | null; scopeName: string | undefined } {
  const stack: { 
    node: { entity: ENREEntityCollectionScoping }; 
    visited: Set<ENREEntityCollectionScoping> 
  }[] = [];
  const initialNode = sGraph.allNodes.find((node) => node.entity === scope);

  if (initialNode) {
    stack.push({ node: initialNode, visited: new Set() });
  }

  while (stack.length > 0) {
    const { node, visited } = stack.pop()!;
    const currentScope = node.entity;

    if (visited.has(currentScope)) continue;
    visited.add(currentScope);

    // 在当前作用域查找函数定义
    for (const child of currentScope.children) {
      if (child.type === 'function' && child.name.codeName === calleeName) {
        return { callee: child, scopeName: currentScope.name.payload };
      }
    }

    // 获取当前作用域的所有相邻节点（父作用域和子作用域）
    const connectedEdges = sGraph.allEdges.filter(
      (edge) => edge.from.entity === currentScope || edge.to.entity === currentScope
    );

    // 将相邻节点压入栈中（逆序以保持DFS顺序）
    for (const edge of connectedEdges.reverse()) {
      const nextNode = edge.from.entity === currentScope ? edge.to : edge.from;
      if (!visited.has(nextNode.entity)) {
        stack.push({ node: nextNode, visited: new Set(visited) });
      }
    }
  }

  return { callee: null, scopeName: undefined };
}