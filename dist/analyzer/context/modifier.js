"use strict";
exports.__esModule = true;
exports.createModifierHandler = exports.ModifierType = void 0;
var data_1 = require("@enre-ts/data");
var location_1 = require("@enre-ts/location");
var ModifierType;
(function (ModifierType) {
    ModifierType[ModifierType["export"] = 0] = "export";
    ModifierType[ModifierType["acceptProperty"] = 1] = "acceptProperty";
})(ModifierType = exports.ModifierType || (exports.ModifierType = {}));
var createModifierHandler = function (_a) {
    var modifiers = _a.modifiers;
    return function (entity) {
        for (var _i = 0, modifiers_1 = modifiers; _i < modifiers_1.length; _i++) {
            var _a = modifiers_1[_i], _ = _a[0], modifier = _a[1];
            if (modifier.type === ModifierType["export"]) {
                if ('location' in entity) {
                    for (var _b = 0, _c = modifier.validRange; _b < _c.length; _b++) {
                        var location_2 = _c[_b];
                        if ((0, location_1.isLocAInLocB)(entity.location, location_2)) {
                            (0, data_1.recordRelationExport)(modifier.proposer, entity, entity.location || location_1.defaultLocation, { kind: 'any', isDefault: modifier.isDefault, isAll: false, sourceRange: undefined, alias: undefined });
                            break;
                        }
                    }
                }
            }
        }
    };
};
exports.createModifierHandler = createModifierHandler;
