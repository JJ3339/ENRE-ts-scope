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
};





    