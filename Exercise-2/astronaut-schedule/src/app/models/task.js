"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var timeUtils_1 = require("../utils/timeUtils");
var Task = /** @class */ (function () {
    function Task(props) {
        this.id = props.id;
        this.description = props.description;
        this.start = props.start;
        this.end = props.end;
        this.priority = props.priority || 'Medium';
        this.completed = props.completed || false;
        if (!Task.validateTimeFormat(this.start) || !Task.validateTimeFormat(this.end)) {
            throw new Error('Invalid time format; expected HH:mm');
        }
        if (Task.parseTimeToMinutes(this.start) >= Task.parseTimeToMinutes(this.end)) {
            throw new Error('Start time must be before end time');
        }
    }
    Task.validateTimeFormat = function (time) {
        if (!/^\d{2}:\d{2}$/.test(time))
            return false;
        var _a = time.split(':'), hhStr = _a[0], mmStr = _a[1];
        var hh = parseInt(hhStr, 10);
        var mm = parseInt(mmStr, 10);
        if (Number.isNaN(hh) || Number.isNaN(mm))
            return false;
        if (hh < 0 || hh > 23)
            return false;
        if (mm < 0 || mm > 59)
            return false;
        return true;
    };
    Task.parseTimeToMinutes = function (time) {
        return (0, timeUtils_1.minutesSinceMidnight)(time);
    };
    return Task;
}());
exports.Task = Task;
