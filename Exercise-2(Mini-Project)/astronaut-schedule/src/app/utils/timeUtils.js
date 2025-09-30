"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minutesSinceMidnight = minutesSinceMidnight;
exports.overlaps = overlaps;
function minutesSinceMidnight(time) {
    var parts = time.split(':');
    if (parts.length !== 2)
        throw new Error('Invalid time');
    var hhStr = parts[0], mmStr = parts[1];
    var hh = parseInt(hhStr, 10);
    var mm = parseInt(mmStr, 10);
    if (Number.isNaN(hh) || Number.isNaN(mm))
        throw new Error('Invalid time');
    if (hh < 0 || hh > 23)
        throw new Error('Invalid hour');
    if (mm < 0 || mm > 59)
        throw new Error('Invalid minute');
    return hh * 60 + mm;
}
function overlaps(aStart, aEnd, bStart, bEnd) {
    var aS = minutesSinceMidnight(aStart);
    var aE = minutesSinceMidnight(aEnd);
    var bS = minutesSinceMidnight(bStart);
    var bE = minutesSinceMidnight(bEnd);
    return aS < bE && bS < aE;
}
