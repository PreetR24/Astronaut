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
var taskFactory_1 = require("./app/factories/taskFactory");
var scheduleManager_1 = require("./app/patterns/singleton/scheduleManager");
var consoleNotifier_1 = require("./app/patterns/observer/consoleNotifier");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var manager, t1, t2, err_1, id, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    manager = scheduleManager_1.ScheduleManager.getInstance();
                    manager.registerNotifier(new consoleNotifier_1.ConsoleNotifier());
                    console.log('--- Smoke test start ---');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    t1 = taskFactory_1.TaskFactory.create({ description: 'Morning Exercise', start: '07:00', end: '08:00', priority: 'High' });
                    return [4 /*yield*/, manager.addTask(t1)];
                case 2:
                    _b.sent();
                    console.log('Added task1 id=', t1.id);
                    t2 = taskFactory_1.TaskFactory.create({ description: 'Breakfast', start: '07:30', end: '07:45', priority: 'Low' });
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, manager.addTask(t2)];
                case 4:
                    _b.sent();
                    console.log('Added task2 id=', t2.id);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    console.log('Expected conflict when adding t2:', err_1.message || err_1);
                    return [3 /*break*/, 6];
                case 6:
                    console.log('All tasks:');
                    console.table(manager.getAllTasks().map(function (t) { return ({ id: t.id, desc: t.description, start: t.start, end: t.end, priority: t.priority, completed: t.completed }); }));
                    id = (_a = manager.getAllTasks()[0]) === null || _a === void 0 ? void 0 : _a.id;
                    if (id) {
                        manager.markComplete(id);
                        console.log('Marked complete:', id);
                    }
                    console.log('After completion:');
                    console.table(manager.getAllTasks().map(function (t) { return ({ id: t.id, desc: t.description, completed: t.completed }); }));
                    if (id) {
                        manager.removeTask(id);
                        console.log('Removed:', id);
                    }
                    console.log('Final tasks:');
                    console.table(manager.getAllTasks().map(function (t) { return ({ id: t.id, desc: t.description }); }));
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _b.sent();
                    console.error('Smoke test error:', err_2);
                    return [3 /*break*/, 8];
                case 8:
                    console.log('--- Smoke test end ---');
                    return [2 /*return*/];
            }
        });
    });
}
run();
