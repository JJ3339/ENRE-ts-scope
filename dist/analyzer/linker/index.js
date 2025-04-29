"use strict";
// @ts-nocheck
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var data_1 = require("@enre-ts/data");
var lookup_1 = require("./lookup");
var core_1 = require("@enre-ts/core");
var bind_repr_to_entity_1 = require("./bind-repr-to-entity");
var literal_handler_1 = require("../visitors/common/literal-handler");
var lookdown_1 = require("./lookdown");
// TODO: Handle import/export type
var bindExport = function (pr) {
    var _a, _b;
    pr.resolved = false;
    var found;
    if (pr.to.role === 'default-export' || pr.to.role === 'any') {
        found = (0, lookup_1["default"])(pr.to);
        if (found.length !== 0) {
            for (var _i = 0, found_1 = found; _i < found_1.length; _i++) {
                var single = found_1[_i];
                (0, data_1.recordRelationExport)(pr.from, single, pr.location, {
                    kind: pr.kind,
                    isDefault: (_a = pr.isDefault) !== null && _a !== void 0 ? _a : false,
                    isAll: pr.isAll,
                    sourceRange: pr.sourceRange,
                    alias: pr.alias
                });
            }
            pr.resolved = true;
        }
    }
    else {
        found = (0, lookup_1["default"])(pr.to);
        if (found) {
            (0, data_1.recordRelationExport)(pr.from, found, pr.location, {
                kind: pr.kind,
                isDefault: (_b = pr.isDefault) !== null && _b !== void 0 ? _b : false,
                isAll: pr.isAll,
                sourceRange: pr.sourceRange,
                alias: pr.alias
            });
            pr.resolved = true;
        }
    }
};
var bindImport = function (pr) {
    pr.resolved = false;
    var found;
    if (pr.to.role === 'default-export' || pr.to.role === 'any') {
        found = (0, lookup_1["default"])(pr.to);
        if (found.length !== 0) {
            for (var _i = 0, found_2 = found; _i < found_2.length; _i++) {
                var single = found_2[_i];
                (0, data_1.recordRelationImport)(pr.from, single, pr.location, {
                    kind: pr.kind,
                    sourceRange: pr.sourceRange,
                    alias: pr.alias
                });
            }
            pr.resolved = true;
        }
    }
    else {
        found = (0, lookup_1["default"])(pr.to);
        if (found) {
            (0, data_1.recordRelationImport)(pr.from, found, pr.location, {
                kind: pr.kind,
                sourceRange: pr.sourceRange,
                alias: pr.alias
            });
            pr.resolved = true;
        }
    }
};
exports["default"] = (function () {
    var _a;
    /**
     * Link `Relation: Export` first
     */
    for (var _i = 0, _b = data_1.pseudoR.exports; _i < _b.length; _i++) {
        var pr = _b[_i];
        bindExport(pr);
    }
    /**
     * Link `Relation: Import` then
     */
    for (var _c = 0, _d = data_1.pseudoR.imports; _c < _d.length; _c++) {
        var pr = _d[_c];
        bindImport(pr);
    }
    /**
     * Most import/export relations should be resolved, however in case of 'import then export',
     * where the export relation was tried to be resolved first, and the dependent import relation was
     * not resolved, and thus the resolve failed.
     *
     * Hence, the second time resolving for import/export is still needed.
     */
    for (var _e = 0, _f = data_1.pseudoR.exports; _e < _f.length; _e++) {
        var pr = _f[_e];
        if (!pr.resolved) {
            bindExport(pr);
        }
    }
    var iterCount = 10;
    /**
     * prevUpdated
     *   - Indicate whether the previous iteration updated points-to relations, its value can only be set by the loop and
     *     always is the previous iteration's `currUpdated`.
     * currUpdated
     *   - Indicate whether the current iteration updates points-to relations, can be set in this iteration.
     *
     * States:
     * 0. prev = undefined && curr = undefined
     *    > The initial state of the first iteration.
     * 1. The first iteration
     *    > **Bind explicit relations**
     *    a. prev = undefined && curr = (undefined->)true
     *       - The first iteration updates points-to relations.
     *    b. prev = undefined && curr = (undefined->)false
     *       - The first iteration does not update any points-to relations.
     * 2. Intermediate iteration
     *    > Propagate points-to relations, **no relations are bound in this state**.
     *    a. prev = true && curr = true
     *       - An intermediate iteration that updates points-to relations.
     *    b. prev = true && curr = false
     *       - An intermediate iteration that does not update points-to relations, and iteration ends.
     * 3. prev = false
     *    > The last iteration, **bind implicit relations** based on points-to relations.
     */
    var prevUpdated = undefined, currUpdated = undefined;
    while (iterCount >= 0 || prevUpdated === false) {
        currUpdated = false;
        var _loop_1 = function (index, task) {
            try {
                if (task.type === 'ascend') {
                    for (var _m = 0, _o = task.payload; _m < _o.length; _m++) {
                        var op = _o[_m];
                        if (op.operation === 'assign') {
                            var resolved = (0, bind_repr_to_entity_1["default"])(op.operand1, task.scope);
                            if (resolved.type !== 'object') {
                                resolved = resolved.pointsTo[0];
                            }
                            var _loop_2 = function (bindingRepr) {
                                var pathContext = undefined;
                                var cursor = [];
                                var _loop_4 = function (binding) {
                                    if (binding.type === 'start') {
                                        // Simple points-to pass
                                        if (resolved.type === 'object') {
                                            if (op.variant === 'for-of') {
                                                var values = undefined;
                                                if (resolved.callable.iterator) {
                                                    values = resolved.callable.iterator.pointsTo[0].callable[0].returns;
                                                }
                                                else {
                                                    values = Object.values(resolved.kv);
                                                }
                                                cursor.push.apply(cursor, values);
                                                if (prevUpdated === false) {
                                                    (0, data_1.recordRelationCall)(task.scope, resolved.callable.iterator, op.operand1.location, { isNew: false }).isImplicit = true;
                                                }
                                            }
                                            else if (op.variant === 'for-await-of') {
                                                var values = undefined;
                                                if (resolved.callable.asyncIterator) {
                                                    values = resolved.callable.asyncIterator.pointsTo[0].callable[0].returns;
                                                }
                                                cursor.push.apply(cursor, values);
                                                if (prevUpdated === false) {
                                                    (0, data_1.recordRelationCall)(task.scope, resolved.callable.asyncIterator, op.operand1.location, { isNew: false }).isImplicit = true;
                                                }
                                            }
                                            else if (op.variant === 'for-in') {
                                                var values = undefined;
                                                // Package string to JSStringLiteral
                                                values = Object.keys(resolved.kv).map(function (k) { return ({
                                                    type: 'string',
                                                    value: k
                                                }); });
                                                cursor.push.apply(cursor, values);
                                                if (prevUpdated === false) {
                                                    (0, data_1.recordRelationUse)(task.scope, resolved, op.operand1.location, { isNew: false });
                                                }
                                            }
                                            else {
                                                cursor.push(resolved);
                                            }
                                        }
                                        // Failed to resolve
                                        else if (resolved.type === 'reference') {
                                            // Leave cursor to be empty
                                        }
                                        // Maybe destructuring, cursor should be JSObjRepr
                                        else {
                                            // TODO: Find right pointsTo item according to valid range
                                            cursor.push.apply(cursor, resolved.pointsTo);
                                        }
                                    }
                                    else if (binding.type === 'obj') {
                                        pathContext = 'obj';
                                    }
                                    else if (binding.type === 'rest') {
                                        cursor = cursor.map(function (c) { return (0, literal_handler_1.getRest)(c, binding); });
                                    }
                                    else if (binding.type === 'array') {
                                        pathContext = 'array';
                                    }
                                    else if (binding.type === 'key') {
                                        var _cursor_1 = [];
                                        cursor.forEach(function (c) {
                                            var selected = undefined;
                                            if (binding.key in c.kv) {
                                                selected = c.kv[binding.key];
                                            }
                                            else if (bindingRepr["default"]) {
                                                selected = (0, bind_repr_to_entity_1["default"])(bindingRepr["default"], task.scope);
                                            }
                                            if (selected) {
                                                if (selected.type === 'object') {
                                                    _cursor_1.push(selected);
                                                }
                                                else if (selected.type === 'reference') {
                                                    // Cannot find referenced entity
                                                }
                                                else {
                                                    _cursor_1.push.apply(_cursor_1, selected.pointsTo);
                                                }
                                            }
                                        });
                                        cursor = _cursor_1;
                                    }
                                };
                                for (var _s = 0, _t = bindingRepr.path; _s < _t.length; _s++) {
                                    var binding = _t[_s];
                                    _loop_4(binding);
                                }
                                cursor.forEach(function (c) {
                                    if (!bindingRepr.entity.pointsTo.includes(c)) {
                                        bindingRepr.entity.pointsTo.push(c);
                                        currUpdated = true;
                                    }
                                });
                            };
                            for (var _p = 0, _q = op.operand0; _p < _q.length; _p++) {
                                var bindingRepr = _q[_p];
                                _loop_2(bindingRepr);
                            }
                        }
                    }
                }
                else if (task.type === 'descend') {
                    var prevSymbol = undefined;
                    var currSymbol_1 = [];
                    var _loop_3 = function (i) {
                        var token = task.payload[i];
                        var nextOperation = (_a = task.payload[i - 1]) === null || _a === void 0 ? void 0 : _a.operation;
                        switch (token.operation) {
                            case 'access': {
                                // Force override currSymbol and go to the next symbol
                                if (token.operand0) {
                                    currSymbol_1 = token.operand0;
                                }
                                else {
                                    var currSymbolHoldsENREEntity = true;
                                    // Access a symbol
                                    if (prevSymbol === undefined) {
                                        // Special variables are resolved with the top priority
                                        // this - mainly for class methods
                                        // FIXME: Currently does not support complex usage (e.g. dynamic this other than class)
                                        if (token.operand1 === 'this') {
                                            // Simply find a class entity along the scope chain
                                            var cursor = task.scope;
                                            while (cursor.type !== 'class') {
                                                cursor = cursor.parent;
                                                if (cursor === undefined) {
                                                    break;
                                                }
                                            }
                                            if (cursor) {
                                                currSymbol_1.push.apply(currSymbol_1, cursor.pointsTo);
                                            }
                                        }
                                        // arguments - function's arguments
                                        else if (token.operand1 === 'arguments') {
                                            currSymbolHoldsENREEntity = false;
                                            if (task.scope.arguments) {
                                                currSymbol_1.push.apply(currSymbol_1, task.scope.arguments);
                                                // currSymbol - JSObjRepr
                                            }
                                        }
                                        // Not special variables, go into the normal name lookup procedure
                                        else {
                                            // ENREEntity as symbol
                                            var found = (0, lookup_1["default"])({
                                                role: 'value',
                                                identifier: token.operand1,
                                                at: task.scope
                                            }, true);
                                            if (found) {
                                                // ENREEntity as entity for explicit relation
                                                currSymbol_1.push(found);
                                            }
                                        }
                                    }
                                    // Access a property of a (previously evaluated) symbol
                                    else if (prevSymbol.length !== 0) {
                                        prevSymbol.forEach(function (s) {
                                            var found = (0, lookdown_1["default"])('name', token.operand1, s);
                                            if (found) {
                                                // ENREEntity as symbol
                                                currSymbol_1.push(found);
                                            }
                                        });
                                    }
                                    else {
                                        // Try to access a property of a symbol, but the symbol is not found
                                    }
                                    if (currSymbolHoldsENREEntity) {
                                        if (prevUpdated === undefined) {
                                            // Head token: ENREEntity as entity for explicit relation
                                            // Non-head token: ENREEntity as symbol, handled in the next token
                                            currSymbol_1.forEach(function (s) {
                                                if (i === task.payload.length - 1) {
                                                    if (['call', 'new'].includes(nextOperation)) {
                                                        (0, data_1.recordRelationCall)(task.scope, s, token.location, { isNew: nextOperation === 'new' });
                                                    }
                                                    else {
                                                        (0, data_1.recordRelationUse)(task.scope, s, token.location);
                                                    }
                                                }
                                            });
                                        }
                                        // Hook function should be provided with ENREEntity as symbol
                                        if (!(task.onFinish && i === 0)) {
                                            /**
                                             * CurrSymbol - ENREEntity as symbol (that holds points-to items)
                                             * or JSObjRepr
                                             */
                                            currSymbol_1 = currSymbol_1.map(function (s) { var _a; return (_a = s.pointsTo) !== null && _a !== void 0 ? _a : [s]; })
                                                .reduce(function (p, c) { return __spreadArray(__spreadArray([], p, true), c, true); }, []);
                                            // All symbols' points-to are extracted for the next evaluation
                                        }
                                    }
                                }
                                break;
                            }
                            case 'assign': {
                                // prevSymbol is ENREEntity as symbol (due to onFinish hook exists)
                                currSymbol_1 = prevSymbol.map(function (s) { return s.pointsTo; }).reduce(function (p, c) { return __spreadArray(__spreadArray([], p, true), c, true); }, []);
                                // currSymbol is JSObjRepr
                                var resolved_1 = (0, bind_repr_to_entity_1["default"])(token.operand1[0], task.scope);
                                if (currSymbol_1.length === 0) {
                                    // This usually happens for code `foo = <...>` rather than `foo.bar = <...>`
                                    // ENREEntity as symbol
                                    var found = (0, lookup_1["default"])({
                                        role: 'value',
                                        identifier: token.operand0.operand1,
                                        at: task.scope
                                    }, true);
                                    if (found) {
                                        found.pointsTo.push(resolved_1);
                                        currSymbol_1 = found.pointsTo;
                                    }
                                }
                                else {
                                    currSymbol_1.forEach(function (s) {
                                        // token.operand0 is AccessToken, its operand1 is the property name
                                        if (token.operand0.operand1 === Symbol.iterator) {
                                            s.callable.iterator = resolved_1;
                                        }
                                        else if (token.operand0.operand1 === Symbol.asyncIterator) {
                                            s.callable.asyncIterator = resolved_1;
                                        }
                                        else {
                                            s.kv[token.operand0.operand1] = resolved_1;
                                        }
                                        currUpdated = true;
                                    });
                                }
                                break;
                            }
                            case 'call':
                            case 'new': {
                                if (prevSymbol === undefined) {
                                    // This situation should not be possible in the new data structure
                                    // Call/New token cannot be the first token of a task
                                }
                                else if (prevSymbol.length !== 0) {
                                    prevSymbol.forEach(function (s) {
                                        // TODO: Does prevSymbol holds only JSOBJRepr?
                                        if (s.type === 'object') {
                                            s.callable.forEach(function (c) { return currSymbol_1.push(c.entity); });
                                        }
                                        else {
                                            currSymbol_1.push(s);
                                        }
                                        // ENREEntity as entity
                                    });
                                    if (prevUpdated === false) {
                                        currSymbol_1.forEach(function (s) {
                                            /**
                                             * If the reference chain is
                                             * ENREEntity as symbol
                                             * -> .pointsTo.callable.entity ENREEntity as entity
                                             * where two ENREEntities are the same, then the call relation should
                                             * be considered as an explicit relation, which was recorded in the
                                             * previous 'access' token.
                                             */
                                            if (data_1.rGraph.where({
                                                from: task.scope,
                                                to: s,
                                                type: 'call',
                                                startLine: token.location.start.line,
                                                startColumn: token.location.start.column
                                            }).length === 0) {
                                                (0, data_1.recordRelationCall)(task.scope, s, token.location, { isNew: token.operation === 'new' }).isImplicit = true;
                                            }
                                        });
                                    }
                                    else {
                                        // Resolve arg->param points-to
                                        var argRepr_1 = (0, bind_repr_to_entity_1["default"])(token.operand1, task.scope);
                                        var params_2 = [];
                                        currSymbol_1.forEach(function (s) {
                                            // To support `arguments` special variable usage
                                            if (s.arguments) {
                                                if (!s.arguments.includes(argRepr_1)) {
                                                    s.arguments.push(argRepr_1);
                                                    currUpdated = true;
                                                }
                                            }
                                            else {
                                                s.arguments = [argRepr_1];
                                                currUpdated = true;
                                            }
                                            params_2.push.apply(params_2, s.children.filter(function (e) { return e.type === 'parameter'; }));
                                        });
                                        var _loop_5 = function (param) {
                                            var cursor = [];
                                            var pathContext = undefined;
                                            var _loop_6 = function (segment) {
                                                switch (segment.type) {
                                                    case 'array':
                                                        // Parameter destructuring path starts from 'array' (not 'start')
                                                        if (pathContext === undefined) {
                                                            pathContext = 'param-list';
                                                            cursor.push(argRepr_1);
                                                        }
                                                        else {
                                                            pathContext = 'array';
                                                        }
                                                        break;
                                                    case 'obj':
                                                        pathContext = 'array';
                                                        break;
                                                    case 'rest':
                                                        cursor = cursor.map(function (c) { return (0, literal_handler_1.getRest)(c, segment); });
                                                        break;
                                                    case 'key': {
                                                        /**
                                                         * Workaround: Use the default value of a parameter no matter
                                                         * whether it has/has not correlated argument. This behavior is
                                                         * adopted by PyCG, we manually add an empty object with the `kv`
                                                         * field, so that the default value can always be used.
                                                         */
                                                        cursor.push({ kv: {} });
                                                        var _cursor_2 = [];
                                                        cursor.forEach(function (c) {
                                                            var selected = undefined;
                                                            if (segment.key in c.kv) {
                                                                selected = c.kv[segment.key];
                                                            }
                                                            else if (param.defaultAlter) {
                                                                selected = (0, bind_repr_to_entity_1["default"])(param.defaultAlter, task.scope);
                                                            }
                                                            if (selected) {
                                                                if (selected.type === 'object') {
                                                                    _cursor_2.push(selected);
                                                                }
                                                                else if (selected.type === 'reference') {
                                                                    // Cannot find referenced entity
                                                                }
                                                                else if (Array.isArray(selected)) {
                                                                    /**
                                                                     * The argument is an array, which is the returned
                                                                     * symbolSnapshot of an expression evaluation.
                                                                     */
                                                                    selected.forEach(function (s) {
                                                                        _cursor_2.push.apply(_cursor_2, s.pointsTo);
                                                                    });
                                                                }
                                                                else {
                                                                    _cursor_2.push.apply(_cursor_2, selected.pointsTo);
                                                                }
                                                            }
                                                        });
                                                        cursor = _cursor_2;
                                                        break;
                                                    }
                                                }
                                            };
                                            for (var _v = 0, _w = param.path; _v < _w.length; _v++) {
                                                var segment = _w[_v];
                                                _loop_6(segment);
                                            }
                                            cursor.forEach(function (c) {
                                                if (!param.pointsTo.includes(c)) {
                                                    param.pointsTo.push(c);
                                                    currUpdated = true;
                                                }
                                            });
                                        };
                                        for (var _u = 0, params_1 = params_2; _u < params_1.length; _u++) {
                                            var param = params_1[_u];
                                            _loop_5(param);
                                        }
                                    }
                                    // Make function's returns currSymbol for next token
                                    currSymbol_1 = [];
                                    prevSymbol.forEach(function (s) {
                                        s.callable.forEach(function (c) {
                                            // c.returns - ENREEntity as symbol
                                            c.returns.forEach(function (r) {
                                                if (task.onFinish && i === 0) {
                                                    currSymbol_1.push(r);
                                                }
                                                else {
                                                    currSymbol_1.push.apply(currSymbol_1, r.pointsTo);
                                                }
                                            });
                                            // ENREEntity as symbol
                                        });
                                    });
                                }
                                break;
                            }
                        }
                        prevSymbol = currSymbol_1;
                        currSymbol_1 = [];
                    };
                    for (var i = task.payload.length - 1; i !== -1; i -= 1) {
                        _loop_3(i);
                    }
                    if (task.onFinish) {
                        var executionSuccess = task.onFinish(prevSymbol);
                        /**
                         * FIXME: The arguments of hook call should be memo-ed, so that the next time
                         * the dependency data was updated, the hook function should be called again.
                         *
                         * Now for simplicity, the hook function is only called once, so that it loses
                         * any data update.
                         *
                         * The explicit return value of `true/false` is only a temporary workaround,
                         * ideally the argument memo mechanism and the hook update mechanism should be
                         * implemented. (Leave it to the next maintainer, hope you can do it :)
                         */
                        if (executionSuccess) {
                            // Make the hook function only be called once (If whatever intended was done)
                            task.onFinish = undefined;
                            currUpdated = true;
                        }
                    }
                }
            }
            catch (_r) {
                if (task.scope) {
                    var filePath = task.scope.type === 'file' ? task.scope.path : task.scope.getSourceFile().path;
                    core_1.codeLogger.error("Points-to relation resolving is experimental, and it fails at ".concat(filePath, " (Task ").concat(index, "/").concat(data_1.postponedTask.all.length, ")"));
                }
                else {
                    core_1.codeLogger.error("Points-to relation resolving is experimental, and it fails at unknown (Task ".concat(index, "/").concat(data_1.postponedTask.all.length, ")"));
                }
            }
        };
        /**
         * Declarations, imports/exports should all be resolved, that is, the symbol structure should already be built,
         * next working on postponed tasks to resolve points-to relations.
         */
        for (var _g = 0, _h = Object.entries(data_1.postponedTask.all); _g < _h.length; _g++) {
            var _j = _h[_g], index = _j[0], task = _j[1];
            _loop_1(index, task);
        }
        // Notice the order of the following state update expressions
        // First count down the iteration counter
        iterCount -= 1;
        // If this iteration is already the last one, then jump out of the loop
        if (prevUpdated === false) {
            break;
        }
        // (If not the last one) Record currUpdated in prevUpdated
        prevUpdated = currUpdated;
        // If the counter is (0->) -1, then set prevUpdated to false for the next iteration to bind implicit relations
        if (iterCount < 0) {
            prevUpdated = false;
        }
    }
    for (var _k = 0, _l = data_1.pseudoR.all; _k < _l.length; _k++) {
        var pr = _l[_k];
        if (pr.resolved) {
            continue;
        }
        switch (pr.type) {
            case 'set': {
                var pr1 = pr;
                var found = (0, lookup_1["default"])(pr1.to);
                if (found) {
                    if (found.type === 'variable' && found.kind === 'const') {
                        core_1.codeLogger.warn("ESError: Cannot assign to '".concat(found.name.string, "' because it is a constant."));
                        continue;
                    }
                    (0, data_1.recordRelationSet)(pr1.from, found, pr1.location, { isInit: pr1.isInit });
                    pr1.resolved = true;
                }
                break;
            }
            case 'modify': {
                var pr1 = pr;
                var found = (0, lookup_1["default"])(pr1.to);
                if (found) {
                    if (found.type === 'variable' && found.kind === 'const') {
                        core_1.codeLogger.warn("ESError: Cannot assign to '".concat(found.name.string, "' because it is a constant."));
                        continue;
                    }
                    (0, data_1.recordRelationModify)(pr1.from, found, pr1.location);
                    pr1.resolved = true;
                }
                break;
            }
            case 'extend': {
                var pr1 = pr;
                var found = (0, lookup_1["default"])(pr.to);
                if (found) {
                    if (pr1.from.type === 'class') {
                        (0, data_1.recordRelationExtend)(pr1.from, found, pr1.location);
                    }
                    else if (pr1.from.type === 'interface') {
                        (0, data_1.recordRelationExtend)(pr1.from, found, pr1.location);
                    }
                    else if (pr1.from.type === 'type parameter') {
                        (0, data_1.recordRelationExtend)(pr1.from, found, pr1.location);
                    }
                    else {
                        core_1.codeLogger.error("Unexpected from entity type ".concat(pr1.from.type, " for `Relation: Extend`."));
                        continue;
                    }
                    pr.resolved = true;
                }
                break;
            }
            case 'override': {
                // Override is handled in the next phase
                break;
            }
            case 'decorate': {
                var pr1 = pr;
                var found = (0, lookup_1["default"])(pr1.from);
                if (found) {
                    (0, data_1.recordRelationDecorate)(found, pr1.to, pr1.location);
                    pr.resolved = true;
                }
                break;
            }
            case 'type': {
                var pr1 = pr;
                var found = (0, lookup_1["default"])(pr1.from);
                if (found) {
                    (0, data_1.recordRelationType)(found, pr1.to, pr1.location);
                    pr.resolved = true;
                }
                break;
            }
            case 'implement': {
                var pr1 = pr;
                var found = (0, lookup_1["default"])(pr1.to);
                if (found) {
                    (0, data_1.recordRelationImplement)(pr1.from, found, pr1.location);
                    pr.resolved = true;
                }
                break;
            }
        }
    }
});
