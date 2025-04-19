import * as d3 from 'd3';
import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import {eGraph, ENREEntityFile} from '@enre-ts/data';
import {getFileContent} from '../utils/fileUtils';
import createENREContext, {ENREContext} from './context';
import {createModifierHandler} from './context/modifier';
import traverseOpts from './visitors';
import {logger} from '../index';
import { sGraph, ENREScopePredicates } from '@enre-ts/data'; // 引入 sGraph 和 ENREScopePredicates

/**
 * Read, parse and analyze a single file.
 */
export const analyze = async (fileEntity: ENREEntityFile) => {
    logger.verbose(`Processing file: ${fileEntity.path}`);

    const content = await getFileContent(fileEntity.path);

    let ast;
    try {
        const plugins = ['decorators'];
        fileEntity.lang === 'ts' ? plugins.push('typescript') : undefined;
        fileEntity.isJsx ? plugins.push('jsx') : undefined;
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
        eGraph.onAdd = createModifierHandler(context);

        if (process.env.NODE_ENV === 'test') {
            traverse<ENREContext>(ast, traverseOpts, undefined, context);
        } else {
            // @ts-ignore
            traverse.default<ENREContext>(ast, traverseOpts, undefined, context);
        }
    }

    // 可视化作用域图
    visualizeScopeGraph(sGraph);
};

interface CustomSimulationNodeDatum extends d3.SimulationNodeDatum {
  id: number;
  name: string;
  type: any;
  x: number; 
  y: number;
}

interface CustomLink extends d3.SimulationLinkDatum<CustomSimulationNodeDatum> {
  value: number;
}

interface CustomSimulationNodeDatum extends d3.SimulationNodeDatum {
  id: number;
  name: string;
  type: any;
  x: number; 
  y: number;
}

// 定义强类型链接
interface CustomLink extends d3.SimulationLinkDatum<CustomSimulationNodeDatum> {
  source: CustomSimulationNodeDatum; 
  target: CustomSimulationNodeDatum; 
  value: number;
}

export function visualizeScopeGraph(scopeContainer: { allNodes: any[]; allEdges: any[] }) {
    // 生成节点时强制初始化 x/y
    const nodes: CustomSimulationNodeDatum[] = scopeContainer.allNodes.map(node => ({
        id: node.entity.id,
        name: node.entity.name.codeName,
        type: node.entity.type,
        x: Math.random() * 800,
        y: Math.random() * 600
    }));

    // 生成链接时直接引用节点对象（而非 id）
    const links: CustomLink[] = scopeContainer.allEdges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.from.entity.id)!;
        const targetNode = nodes.find(n => n.id === edge.to.entity.id)!;
        return {
            source: sourceNode, 
            target: targetNode,  
            value: 2
        };
    });

    const width = 800;
    const height = 600;

    const svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // 强制指定仿真节点的泛型类型
    const simulation = d3.forceSimulation<CustomSimulationNodeDatum>(nodes)
      .force('link', d3.forceLink<CustomSimulationNodeDatum, CustomLink>(links) 
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // 渲染链接
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value));

    // 渲染节点
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5);

    // 在 tick 事件中直接访问节点属性
    simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x) 
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
    });
}
    