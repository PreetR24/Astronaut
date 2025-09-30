"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ScheduleManager = void 0;
var task_1 = require("../../models/task");
var validationService_1 = require("../../services/validationService");
var logger_1 = require("../../logger/logger");
var persistenceService_1 = require("../../services/persistenceService");
var ScheduleManager = /** @class */ (function () {
    function ScheduleManager() {
        this.tasks = new Map();
        this.notifiers = new Set();
    }
    ScheduleManager.getInstance = function () {
        if (!ScheduleManager.instance)
            ScheduleManager.instance = new ScheduleManager();
        // synchronous load (local file) for quick access — async init preferred for supabase
        try {
            var loaded = persistenceService_1.PersistenceService.loadSync();
            if (loaded && loaded.tasks) {
                for (var _i = 0, _a = loaded.tasks; _i < _a.length; _i++) {
                    var t = _a[_i];
                    ScheduleManager.instance.tasks.set(t.id, t);
                }
            }
        }
        catch (e) {
            // ignore
        }
        return ScheduleManager.instance;
    };
    // async initialization to load from remote persistence (e.g., Supabase)
    ScheduleManager.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loaded, _i, _a, t, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!ScheduleManager.instance)
                            ScheduleManager.instance = new ScheduleManager();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, persistenceService_1.PersistenceService.loadAll()];
                    case 2:
                        loaded = _b.sent();
                        if (loaded && loaded.tasks) {
                            ScheduleManager.instance.tasks.clear();
                            for (_i = 0, _a = loaded.tasks; _i < _a.length; _i++) {
                                t = _a[_i];
                                ScheduleManager.instance.tasks.set(t.id, t);
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, ScheduleManager.instance];
                }
            });
        });
    };
    ScheduleManager.getInstanceAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (process.env.STORAGE === 'supabase') {
                    return [2 /*return*/, this.init()];
                }
                return [2 /*return*/, this.getInstance()];
            });
        });
    };
    ScheduleManager.prototype.registerNotifier = function (n) {
        this.notifiers.add(n);
    };
    ScheduleManager.prototype.unregisterNotifier = function (n) {
        this.notifiers.delete(n);
    };
    ScheduleManager.prototype.notify = function (event, payload) {
        this.notifiers.forEach(function (n) { return n.notify(event, payload); });
    };
    ScheduleManager.prototype.addTask = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var logger, conflict, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger = (0, logger_1.getLogger)();
                        conflict = validationService_1.ValidationService.detectOverlap(task, Array.from(this.tasks.values()));
                        if (conflict) {
                            this.notify('task_conflict', { task: task, conflict: conflict });
                            logger.warn("Conflict adding task ".concat(task.id, " with ").concat(conflict.id));
                            throw new Error("Task conflicts with existing task: ".concat(conflict.description));
                        }
                        this.tasks.set(task.id, task);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, persistenceService_1.PersistenceService.saveWithRetry({ tasks: Array.from(this.tasks.values()) })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        logger.warn('Failed to persist tasks after add', err_1);
                        return [3 /*break*/, 4];
                    case 4:
                        this.notify('task_added', task);
                        logger.info("Task added: ".concat(task.id));
                        return [2 /*return*/];
                }
            });
        });
    };
    ScheduleManager.prototype.removeTask = function (id) {
        var existed = this.tasks.delete(id);
        if (existed) {
            this.notify('task_removed', { id: id });
            (0, logger_1.getLogger)().info("Task removed: ".concat(id));
            // persist
            persistenceService_1.PersistenceService.saveWithRetry({ tasks: Array.from(this.tasks.values()) }).catch(function (e) { return (0, logger_1.getLogger)().warn('Failed to persist after remove', e); });
        }
        return existed;
    };
    ScheduleManager.prototype.editTask = function (id, updates) {
        var t = this.tasks.get(id);
        if (!t)
            return false;
        var merged = __assign(__assign({}, t), updates);
        // revalidate times
        try {
            if (!task_1.Task.validateTimeFormat(merged.start) || !task_1.Task.validateTimeFormat(merged.end)) {
                return false;
            }
            if (task_1.Task.parseTimeToMinutes(merged.start) >= task_1.Task.parseTimeToMinutes(merged.end))
                return false;
        }
        catch (err) {
            return false;
        }
        var conflict = validationService_1.ValidationService.detectOverlap(merged, Array.from(this.tasks.values()));
        if (conflict) {
            this.notify('task_conflict', { updated: merged, conflict: conflict });
            return false;
        }
        this.tasks.set(id, merged);
        this.notify('task_edited', { id: id, updates: updates });
        (0, logger_1.getLogger)().info("Task edited: ".concat(id));
        persistenceService_1.PersistenceService.saveWithRetry({ tasks: Array.from(this.tasks.values()) }).catch(function (e) { return (0, logger_1.getLogger)().warn('Failed to persist after edit', e); });
        return true;
    };
    ScheduleManager.prototype.markComplete = function (id) {
        var t = this.tasks.get(id);
        if (!t)
            return false;
        t.completed = true;
        this.tasks.set(id, t);
        this.notify('task_completed', { id: id });
        (0, logger_1.getLogger)().info("Task completed: ".concat(id));
        persistenceService_1.PersistenceService.saveWithRetry({ tasks: Array.from(this.tasks.values()) }).catch(function (e) { return (0, logger_1.getLogger)().warn('Failed to persist after complete', e); });
        return true;
    };
    ScheduleManager.prototype.getAllTasks = function () {
        return Array.from(this.tasks.values()).sort(function (a, b) {
            var pa = task_1.Task.parseTimeToMinutes(a.start);
            var pb = task_1.Task.parseTimeToMinutes(b.start);
            return pa - pb;
        });
    };
    ScheduleManager.prototype.getTasksByPriority = function (priority) {
        return this.getAllTasks().filter(function (t) { return t.priority === priority; });
    };
    return ScheduleManager;
}());
exports.ScheduleManager = ScheduleManager;
