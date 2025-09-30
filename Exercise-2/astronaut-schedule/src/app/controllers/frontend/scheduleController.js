"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleControllerDefault = void 0;
exports.scheduleController = scheduleController;
var taskFactory_1 = require("../../factories/taskFactory");
var scheduleManager_1 = require("../../patterns/singleton/scheduleManager");
var logger_1 = require("../../logger/logger");
var manager = scheduleManager_1.ScheduleManager.getInstance();
function parseEditFlags(args) {
    var updates = {};
    for (var i = 0; i < args.length; i++) {
        var a = args[i];
        if (a === '--desc' && args[i + 1]) {
            updates.description = args[++i];
        }
        else if (a === '--start' && args[i + 1]) {
            updates.start = args[++i];
        }
        else if (a === '--end' && args[i + 1]) {
            updates.end = args[++i];
        }
        else if (a === '--priority' && args[i + 1]) {
            updates.priority = args[++i];
        }
    }
    return updates;
}
function scheduleController(cmd, args) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, _a, description, start, end, priority, task, err_1, flag, tasks, _i, tasks_1, t, key_1, ok, found, id, updates, ok, key_2, ok, found;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger = (0, logger_1.getLogger)();
                    _a = cmd;
                    switch (_a) {
                        case 'help': return [3 /*break*/, 1];
                        case 'add': return [3 /*break*/, 2];
                        case 'view': return [3 /*break*/, 7];
                        case 'remove': return [3 /*break*/, 8];
                        case 'edit': return [3 /*break*/, 9];
                        case 'complete': return [3 /*break*/, 10];
                        case 'exit': return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 12];
                case 1:
                    console.log('Commands:');
                    console.log('  add "description" HH:mm HH:mm [High|Medium|Low]');
                    console.log('  remove <id|description>');
                    console.log('  view [--priority High|Medium|Low]');
                    console.log('  edit <id> [--desc "..."] [--start HH:mm] [--end HH:mm] [--priority High]');
                    console.log('  complete <id|description>');
                    console.log('  help');
                    console.log('  exit');
                    return [3 /*break*/, 13];
                case 2:
                    description = args[0], start = args[1], end = args[2], priority = args[3];
                    if (!description || !start || !end) {
                        console.error('Usage: add "description" HH:mm HH:mm [Priority]');
                        return [3 /*break*/, 13];
                    }
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    task = taskFactory_1.TaskFactory.create({ description: description, start: start, end: end, priority: priority });
                    return [4 /*yield*/, manager.addTask(task)];
                case 4:
                    _b.sent();
                    console.log('Task added successfully. id=', task.id);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    logger.warn(err_1.message || err_1);
                    console.error('Error:', err_1.message || err_1);
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 13];
                case 7:
                    {
                        flag = args[0];
                        tasks = manager.getAllTasks();
                        if (flag === '--priority' && args[1]) {
                            tasks = manager.getTasksByPriority(args[1]);
                        }
                        if (!tasks || tasks.length === 0) {
                            console.log('No tasks scheduled for the day.');
                        }
                        else {
                            for (_i = 0, tasks_1 = tasks; _i < tasks_1.length; _i++) {
                                t = tasks_1[_i];
                                console.log("".concat(t.start, " - ").concat(t.end, ": ").concat(t.description, " [").concat(t.priority, "]").concat(t.completed ? ' (Completed)' : '', " (id: ").concat(t.id, ")"));
                            }
                        }
                        return [3 /*break*/, 13];
                    }
                    _b.label = 8;
                case 8:
                    {
                        key_1 = args.join(' ');
                        if (!key_1) {
                            console.error('Usage: remove <id|description>');
                            return [3 /*break*/, 13];
                        }
                        ok = manager.removeTask(key_1);
                        if (!ok) {
                            found = manager.getAllTasks().find(function (t) { return t.description === key_1 || t.description.includes(key_1); });
                            if (found)
                                ok = manager.removeTask(found.id);
                        }
                        console.log(ok ? 'Task removed successfully.' : 'Error: Task not found.');
                        return [3 /*break*/, 13];
                    }
                    _b.label = 9;
                case 9:
                    {
                        id = args[0];
                        if (!id) {
                            console.error('Usage: edit <id> [--desc "..."] [--start HH:mm] [--end HH:mm] [--priority <level>]');
                            return [3 /*break*/, 13];
                        }
                        updates = parseEditFlags(args.slice(1));
                        ok = manager.editTask(id, updates);
                        console.log(ok ? 'Task updated successfully.' : 'Error: Could not update task (conflict or invalid data).');
                        return [3 /*break*/, 13];
                    }
                    _b.label = 10;
                case 10:
                    {
                        key_2 = args.join(' ');
                        if (!key_2) {
                            console.error('Usage: complete <id|description>');
                            return [3 /*break*/, 13];
                        }
                        ok = manager.markComplete(key_2);
                        if (!ok) {
                            found = manager.getAllTasks().find(function (t) { return t.description === key_2 || t.description.includes(key_2); });
                            if (found)
                                ok = manager.markComplete(found.id);
                        }
                        console.log(ok ? 'Task marked as completed.' : 'Error: Task not found.');
                        return [3 /*break*/, 13];
                    }
                    _b.label = 11;
                case 11: return [2 /*return*/, true];
                case 12:
                    console.log('Unknown command. Type help');
                    _b.label = 13;
                case 13: return [2 /*return*/, false];
            }
        });
    });
}
exports.scheduleControllerDefault = scheduleController;
