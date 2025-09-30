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
var taskFactory_1 = require("../app/factories/taskFactory");
var scheduleManager_1 = require("../app/patterns/singleton/scheduleManager");
describe('Edge cases and validations', function () {
    var manager;
    beforeEach(function () {
        manager = scheduleManager_1.ScheduleManager.getInstance();
        // clear existing tasks
        for (var _i = 0, _a = manager.getAllTasks(); _i < _a.length; _i++) {
            var t = _a[_i];
            manager.removeTask(t.id);
        }
    });
    test('factory rejects invalid hour like 25:00', function () {
        expect(function () { return taskFactory_1.TaskFactory.create({ description: 'Bad', start: '25:00', end: '26:00' }); }).toThrow(/Invalid time/);
    });
    test('factory rejects invalid minute like 09:60', function () {
        expect(function () { return taskFactory_1.TaskFactory.create({ description: 'Bad', start: '09:60', end: '10:00' }); }).toThrow(/Invalid time/);
    });
    test('cannot add overlapping tasks via edit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t1 = taskFactory_1.TaskFactory.create({ description: 'A', start: '10:00', end: '11:00' });
                    t2 = taskFactory_1.TaskFactory.create({ description: 'B', start: '11:00', end: '12:00' });
                    return [4 /*yield*/, manager.addTask(t1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, manager.addTask(t2)];
                case 2:
                    _a.sent();
                    ok = manager.editTask(t2.id, { start: '10:30', end: '11:30' });
                    expect(ok).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    test('remove non-existent task returns false', function () {
        var ok = manager.removeTask('no-such-id');
        expect(ok).toBe(false);
    });
    test('mark complete by description works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var t, found, ok, updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t = taskFactory_1.TaskFactory.create({ description: 'CompleteMe', start: '14:00', end: '15:00' });
                    return [4 /*yield*/, manager.addTask(t)];
                case 1:
                    _a.sent();
                    found = manager.getAllTasks().find(function (x) { return x.description === 'CompleteMe'; });
                    expect(found).toBeDefined();
                    ok = manager.markComplete(found.id);
                    expect(ok).toBe(true);
                    updated = manager.getAllTasks().find(function (x) { return x.id === found.id; });
                    expect(updated.completed).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    test('view empty returns empty list', function () {
        var all = manager.getAllTasks();
        expect(all.length).toBe(0);
    });
});
