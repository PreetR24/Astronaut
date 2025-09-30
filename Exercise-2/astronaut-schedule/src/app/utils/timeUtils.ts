export function minutesSinceMidnight(time: string): number {
  const parts = time.split(':');
  if (parts.length !== 2) throw new Error('Invalid time');
  const [hhStr, mmStr] = parts;
  const hh = parseInt(hhStr, 10);
  const mm = parseInt(mmStr, 10);
  if (Number.isNaN(hh) || Number.isNaN(mm)) throw new Error('Invalid time');
  if (hh < 0 || hh > 23) throw new Error('Invalid hour');
  if (mm < 0 || mm > 59) throw new Error('Invalid minute');
  return hh * 60 + mm;
}

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const aS = minutesSinceMidnight(aStart);
  const aE = minutesSinceMidnight(aEnd);
  const bS = minutesSinceMidnight(bStart);
  const bE = minutesSinceMidnight(bEnd);
  return aS < bE && bS < aE;
}