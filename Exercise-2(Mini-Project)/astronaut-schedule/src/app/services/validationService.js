"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
var timeUtils_1 = require("../utils/timeUtils");
var ValidationService = /** @class */ (function () {
    function ValidationService() {
    }
    ValidationService.detectOverlap = function (task, others) {
        for (var _i = 0, others_1 = others; _i < others_1.length; _i++) {
            var t = others_1[_i];
            if (t.id === task.id)
                continue;
            if ((0, timeUtils_1.overlaps)(task.start, task.end, t.start, t.end))
                return t;
        }
        return null;
    };
    return ValidationService;
}());
exports.ValidationService = ValidationService;
