"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = lookdown;
function lookdown(by, payload, scope) {
    var waitingList = undefined;
    if (scope.type === 'object') {
        waitingList = [scope];
    }
    else {
        waitingList = __spreadArray([], scope.children, true);
    }
    // TODO: Condition disable points-to search?
    if ('pointsTo' in scope) {
        /**
         * `pointsTo` can hold either ENREEntity or JSObjRepr, and ENREEntities are add to list for name searching,
         * JSObjRepr(s) have its own dedicate searching mechanism.
         */
        waitingList.push.apply(waitingList, scope.pointsTo.filter(function (i) { return i.type !== 'object'; }));
    }
    for (var _i = 0, waitingList_1 = waitingList; _i < waitingList_1.length; _i++) {
        var item = waitingList_1[_i];
        if (by === 'loc-key') {
            if ('location' in item) {
                // @ts-ignore
                if (item.location.start.line === payload.line
                    // @ts-ignore
                    && item.location.start.column === payload.column) {
                    return item;
                }
            }
        }
        else if (by === 'name') {
            if (item.type === 'object') {
                if (payload in item.kv) {
                    return item.kv[payload];
                }
            }
            else {
                if (item.name.codeName === payload) {
                    return item;
                }
            }
        }
        if ('children' in item) {
            waitingList.push.apply(waitingList, item.children);
        }
    }
    // if ('pointsTo' in scope) {
    //   for (const objRepr of scope.pointsTo.filter(i => i.type === 'object')) {
    //     if ((payload as string) in objRepr.kv) {
    //       return objRepr.kv[payload as string];
    //     }
    //   }
    // }
    return undefined;
}
