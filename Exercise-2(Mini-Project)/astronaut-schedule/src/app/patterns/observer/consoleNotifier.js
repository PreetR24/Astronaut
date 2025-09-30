"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleNotifier = void 0;
var logger_1 = require("../../logger/logger");
var ConsoleNotifier = /** @class */ (function () {
    function ConsoleNotifier() {
    }
    ConsoleNotifier.prototype.notify = function (event, payload) {
        var logger = (0, logger_1.getLogger)();
        var msg = "[".concat(event, "] ").concat(payload ? JSON.stringify(payload) : '');
        console.log(msg);
        logger.info(msg);
    };
    return ConsoleNotifier;
}());
exports.ConsoleNotifier = ConsoleNotifier;
