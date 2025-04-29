"use strict";
/**
 * TSTypeAnnotation
 *
 * Extracted entities:
 *   * N/A
 *
 * Extracted relations:
 *   * type
 */
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
exports["default"] = (function (path, _a) {
    var logs = _a.file.logs, scope = _a.scope;
    if (path.parent.type === 'ClassMethod' && path.parent.kind === 'constructor') {
        logs.add(path.node.loc.start.line, "Type annotation cannot appear on a constructor declaration." /* ENRELogEntry['Type annotation cannot appear on a constructor declaration'] */);
        return;
    }
    var annotationType = path.node.typeAnnotation.type;
    if (annotationType === 'TSTypeReference') {
        var referenceType = path.node.typeAnnotation.typeName.type;
        if (referenceType === 'Identifier') {
            data_1.pseudoR.add({
                type: 'type',
                from: { role: 'type', identifier: path.node.typeAnnotation.typeName.name, at: scope.last() },
                /**
                 * In @babel/traverse, for a function/method, the 'returnType' node is visited after 'params' and
                 * 'body', where eGraph.lastAdded may be overridden to param entity or any other declarations within
                 * the function body. In these cases, we can utilize the current scope to refer to the function/method.
                 *
                 * Need to monitor if this condition is correct.
                 */
                to: ['Identifier', 'ClassProperty'].includes(path.parent.type) ? data_1.eGraph.lastAdded : scope.last(),
                location: (0, location_1.toENRELocation)(path.node.typeAnnotation.typeName.loc)
            });
        }
    }
    else if (annotationType === 'TSIndexedAccessType') {
    }
    else { // @ts-ignore
        if (annotationType === 'TSQualifiedName') {
        }
    }
});
