import { analyze } from '.';
import { ENREEntityFile, recordEntityFile } from '@enre-ts/data';
import ENREName from '@enre-ts/naming';

// 定义要分析的文件路径
const filePath = 'packages/enre-core/src/analyzer/test.ts';

// 创建 ENREEntityFile 实例
const fileEntity: ENREEntityFile = recordEntityFile(
  new ENREName('File', filePath.split('/').pop() || 'test.ts'), // 确保有默认文件名
  filePath,
  'module',    // sourceType: 'module' | 'script'
  'ts',        // lang: 'ts' | 'js'
  false,       // isJsx: boolean
  undefined    // parent?: ENREEntityPackage
);

// 调用 analyze 函数进行文件分析
async function runAnalysis() {
  try {
    await analyze(fileEntity);
    console.log('文件分析完成');
  } catch (error) {
    console.error('文件分析失败:', error);
  }
}

// 执行分析
runAnalysis();