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
import Sigma from 'sigma';

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
    //visualizeScopeGraph(sGraph);

    logger.verbose('所有作用域节点信息:');
    sGraph.allNodes.forEach((node, index) => {
        logger.verbose(`节点 ${index + 1}:`);
        logger.verbose(`  名称: ${node.entity.name.codeName || node.entity.name}`);
        logger.verbose(`  类型: ${node.entity.type}`);
        if (node.entity.parent) {
            logger.verbose(`  父节点 name: ${node.entity.parent.name}`);
        }
    });

    // 打印所有边信息
    logger.verbose('\n所有作用域边信息:');
    sGraph.allEdges.forEach((edge, index) => {
        logger.verbose(`边 ${index + 1}:`);
        logger.verbose(`  起点: ${edge.from.entity.name.codeName || edge.from.entity.name}`);
        logger.verbose(`  终点: ${edge.to.entity.name.codeName || edge.to.entity.name}`);
    });
};





    