"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskFactory = void 0;
var uuid_1 = require("uuid");
var task_1 = require("../models/task");
var TaskFactory = /** @class */ (function () {
    function TaskFactory() {
    }
    TaskFactory.create = function (input) {
        if (!input.description || input.description.trim().length === 0) {
            throw new Error('Description required');
        }
        var id = (0, uuid_1.v4)();
        return new task_1.Task({
            id: id,
            description: input.description.trim(),
            start: input.start,
            end: input.end,
            priority: input.priority || 'Medium',
        });
    };
    return TaskFactory;
}());
exports.TaskFactory = TaskFactory;
