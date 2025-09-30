"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timeUtils_1 = require("../app/utils/timeUtils");
var task_1 = require("../app/models/task");
var globals_1 = require("@jest/globals");
(0, globals_1.describe)('time utils', function () {
    (0, globals_1.test)('overlap detection basic', function () {
        (0, globals_1.expect)((0, timeUtils_1.overlaps)('07:00', '08:00', '07:30', '08:30')).toBe(true);
        (0, globals_1.expect)((0, timeUtils_1.overlaps)('07:00', '08:00', '08:00', '09:00')).toBe(false);
    });
    (0, globals_1.test)('task validation ensures start before end', function () {
        (0, globals_1.expect)(function () { return new task_1.Task({ id: 'x', description: 't', start: '09:00', end: '08:00' }); }).toThrow();
    });
});
