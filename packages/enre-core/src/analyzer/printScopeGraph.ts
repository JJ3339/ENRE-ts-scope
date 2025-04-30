import { sGraph } from "@enre-ts/data";

/*export printScopeGraph = () => {
    // 打印所有节点信息
    console.log('所有作用域节点信息:');
    sGraph.allNodes.forEach((node, index) => {
        console.log(`节点 ${index + 1}:`);
        console.log(`  名称: ${node.entity.name.codeName || node.entity.name}`);
        console.log(`  类型: ${node.entity.type}`);
        if (node.entity.parent) {
            console.log(`  父节点 name: ${node.entity.parent.name}`);
        }
    });

    // 打印所有边信息
    console.log('\n所有作用域边信息:');
    sGraph.allEdges.forEach((edge, index) => {
        console.log(`边 ${index + 1}:`);
        console.log(`  起点: ${edge.from.entity.name.codeName || edge.from.entity.name}`);
        console.log(`  终点: ${edge.to.entity.name.codeName || edge.to.entity.name}`);
    });
}*/