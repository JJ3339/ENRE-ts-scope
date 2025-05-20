import * as d3 from "d3";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { eGraph, ENREEntityFile } from "@enre-ts/data";
import { getFileContent } from "../utils/fileUtils";
import createENREContext, { ENREContext } from "./context";
import { createModifierHandler } from "./context/modifier";
import traverseOpts from "./visitors";
import { logger } from "../index";
import { sGraph, ENREScopePredicates } from "@enre-ts/data";
import express from "express";
import cors from "cors";
import { variableDeclaration } from "@babel/types";

/**
 * Read, parse and analyze a single file.
 */
export const analyze = async (fileEntity: ENREEntityFile) => {
  logger.verbose(`Processing file: ${fileEntity.path}`);

  const content = await getFileContent(fileEntity.path);

  let ast;
  try {
    const plugins = ["decorators"];
    fileEntity.lang === "ts" ? plugins.push("typescript") : undefined;
    fileEntity.isJsx ? plugins.push("jsx") : undefined;
    ast = parse(content, {
      // This seems to be a parser bug, which only affects the first line
      // startColumn: 1,
      sourceType: fileEntity.sourceType,
      // @ts-ignore
      plugins,
      /**
       * Enabling error recovery suppresses some TS errors
       * and make it possible to deal with in user space.
       */
      errorRecovery: true,
    });
  } catch {
    logger.error(`Failed to parse the file ${fileEntity.getQualifiedName()}`);
  }

  if (ast) {
    const context = createENREContext(fileEntity);
    sGraph.add(fileEntity); // 将文件实体添加到作用域图中(全局作用域)
    eGraph.onAdd = createModifierHandler(context);

    if (process.env.NODE_ENV === "test") {
      traverse<ENREContext>(ast, traverseOpts, undefined, context);
    } else {
      // @ts-ignore
      traverse.default<ENREContext>(ast, traverseOpts, undefined, context);
    }
  }

  console.log("所有作用域节点信息:");
  sGraph.allNodes.forEach((node, index) => {
    console.log(`节点 ${index + 1}:`);
    console.log(`  名称: ${node.entity.name.codeName || node.entity.name}`);
    console.log(`  类型: ${node.entity.type}`);
    if (node.entity.parent) {
      console.log(`  父节点 ${node.entity.parent.name.payload}`);
    }
    // 打印节点内的变量声明
    if (node.variables.length > 0) {
      node.variables.forEach((variable, varIndex) => {
        console.log(
          `节点 ${index + 1}下:变量 ${varIndex + 1}: ${variable.name.codeName}数值为：${
            variable.value
          }`
        );
        console.log(`  变量类型: ${variable.callType}`);
      });
    } else {
      console.log("无变量声明");
    }

    if(node.modules.length > 0) {
      node.modules.forEach((module, modIndex) => {
        console.log(
          `节点 ${index + 1}下:模块 ${modIndex + 1}: ${module.name.codeName}`
        );
      });
    } else { 
      console.log("无模块声明");
    }

    if(node.importNamespaces.length > 0){
      node.importNamespaces.forEach((namespace, namespaceIndex) => {
        console.log(
          `节点 ${index + 1}下:引用命名空间 ${namespaceIndex + 1}: ${namespace}`
        );
      });
    }else{
      console.log("无引用命名空间声明");
    }

    if(node.exportVariables.length > 0){
      node.exportVariables.forEach((exportedVarible, VariableIndex) => {
        console.log(
          `节点 ${index + 1}下:可导出的变量有 ${VariableIndex + 1}: ${exportedVarible.name.codeName}`
        );
      });
    }else{  
      console.log("!!!");
    }

  });

  

  // 打印所有边信息
  console.log("\n所有作用域边信息:");
  sGraph.allEdges.forEach((edge, index) => {
    console.log(`边 ${index + 1}:`);
    console.log(`  类型: ${edge.type}`);
    console.log(`  起点: ${edge.from.entity.name.codeName || edge.from.entity.name}`);
    console.log(`  终点: ${edge.to.entity.name.codeName || edge.to.entity.name}`);
  });

/* // 创建 Express 应用
const app = express();
const port = 3000;

// 启用 CORS
app.use(cors());

// 定义 API 端点，返回 sGraph 数据
app.get("/sGraph", (req, res) => {
  // 创建节点ID到数组下标的映射表
  const nodeIdMap = new Map();
  
  const nodes = sGraph.allNodes.map((node, index) => {
    const originalId = node.entity.name.payload;
    nodeIdMap.set(originalId, index);  // 存储原始ID到数组下标的映射
    return {
      id: index,  // 使用数组下标作为新ID
      name: node.entity.name.codeName,
      type: node.entity.type,
      variables: node.variables.map(variable => ({
        name: variable.name.codeName,
        value: variable.value,
        type: variable.callType
      }))
    };
  });

  const edges = sGraph.allEdges.map(edge => {
    const sourceIndex = nodeIdMap.get(edge.from.entity.name.payload);
    const targetIndex = nodeIdMap.get(edge.to.entity.name.payload);

    if (sourceIndex === undefined || targetIndex === undefined) {
      console.error(`Error mapping edge: source or target index is undefined`);
      return null;
    }

    return {
      source: sourceIndex,
      target: targetIndex,
      type: edge.type
    };
  }).filter(edge => edge !== null);

  const sGraphData = {
    allNodes: nodes,
    allEdges: edges
  };

  res.json(sGraphData);
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); */

};
