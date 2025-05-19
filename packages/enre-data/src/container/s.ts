// packages/enre-data/src/container/s.ts
import {
  ENREEntityCollectionScoping,
  ENREEntityFunction,
  ENREEntityNamespace,
  ENREEntityVariable,
} from "@enre-ts/data";

// 定义作用域图的节点
class ScopeNode {
  constructor(
    public entity: ENREEntityCollectionScoping,
    public children: ScopeNode[] = [],
    public variables: ENREEntityVariable[] = [],
    public functions: ENREEntityFunction[] = [],
    public modules: ENREEntityNamespace[] = [],
    public imports: ENREEntityNamespace[] = [],
    public exports: ENREEntityNamespace[] = [],
  ) {}
}

// 定义作用域图的边
class ScopeEdge {
  constructor(
    public from: ScopeNode,
    public to: ScopeNode,
    public type: "parent" | "call"
  ) {}
}

// 定义作用域查询条件接口
export interface ENREScopePredicates {
  type?: string;
  name?: string | RegExp;
  parent?: ENREEntityCollectionScoping;
  child?: ENREEntityCollectionScoping;
  // 可以根据需要添加更多查询条件
}

// 创建作用域容器
const createScopeContainer = () => {
  let _s: ScopeNode[] = [];
  let _edges: ScopeEdge[] = [];

  return {
    // 添加作用域
    add: (scope: ENREEntityCollectionScoping) => {
      const newNode = new ScopeNode(scope);
      _s.push(newNode);

      if (scope.parent) {
        const parentNode = _s.find((node) => node.entity === scope.parent);
        if (parentNode) {
          parentNode.children.push(newNode);
          const newEdge = new ScopeEdge(parentNode, newNode, "parent");
          _edges.push(newEdge);
        }
      }
    },

    //添加变量定义
    addVariable: (scope: ENREEntityCollectionScoping, variable: ENREEntityVariable) => {
      const scopeNode = _s.find((node) => node.entity === scope);
      if (scopeNode) {
        scopeNode.variables.push(variable);
      }
    },

    //添加函数定义
    addFunction: (scope: ENREEntityCollectionScoping, func: ENREEntityFunction) => {
      const scopeNode = _s.find((node) => node.entity === scope);
      if (scopeNode) {
        scopeNode.functions.push(func);
      }
    },

    addModule: (scope: ENREEntityCollectionScoping, module: ENREEntityNamespace) => {
      const scopeNode = _s.find((node) => node.entity === scope);
      if (scopeNode) {
        scopeNode.modules.push(module);
      }
    },

    addImportedNamespace: (scope: ENREEntityCollectionScoping, namespace: ENREEntityNamespace) => {
        const scopeNode = _s.find((node) => node.entity === scope);
        if (scopeNode) {
            scopeNode.imports.push(namespace);
        }
    },
    
    addExportedNamespace: (scope: ENREEntityCollectionScoping, namespace: ENREEntityNamespace) => {
        const scopeNode = _s.find((node) => node.entity === scope);
        if (scopeNode) {
            scopeNode.exports.push(namespace);
        }
    },

    // 添加函数调用关系
    addFunctionCall: (
      callerScope: ENREEntityCollectionScoping,
      callee: ENREEntityFunction
    ) => {
      const callerNode = _s.find((node) => node.entity === callerScope);
      const calleeNode = _s.find((node) => node.functions.includes(callee));
      if (callerNode && calleeNode) {
        const newEdge = new ScopeEdge(callerNode, calleeNode, "call");
        _edges.push(newEdge);
      }
    },

    get last() {
      return _s[_s.length - 1];
    },

    // 获取所有作用域节点
    get allNodes() {
      return _s;
    },

    // 获取所有作用域边
    get allEdges() {
      return _edges;
    },

    // 根据条件查找作用域
    where: ({ type, name, parent, child }: ENREScopePredicates) => {
      let candidate = _s;

      if (type) {
        candidate = candidate.filter((s) => s.entity.type === type);
      }

      if (typeof name === "string") {
        candidate = candidate.filter(
          (s) =>
            (typeof s.entity.name === "string" ? s.entity.name : s.entity.name.string) ===
            name
        );
      } else if (name instanceof RegExp) {
        candidate = candidate.filter((s) =>
          name.test(
            typeof s.entity.name === "string" ? s.entity.name : s.entity.name.string
          )
        );
      }

      if (parent) {
        candidate = candidate.filter((s) => s.entity.parent === parent);
      }

      /*if (child) {
                candidate = candidate.filter(s => s.entity.children?.includes(child));
            }*/

      return candidate;
    },

    // 重置作用域容器
    reset: () => {
      _s = [];
      _edges = [];
    },
  };
};

//导出全局作用域容器实例
export default createScopeContainer();
