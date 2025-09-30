import { overlaps } from '../app/utils/timeUtils';
import { Task } from '../app/models/task';
import { describe, test, expect } from '@jest/globals';

describe('time utils', () => {
  test('overlap detection basic', () => {
    expect(overlaps('07:00', '08:00', '07:30', '08:30')).toBe(true);
    expect(overlaps('07:00', '08:00', '08:00', '09:00')).toBe(false);
  });

  test('task validation ensures start before end', () => {
    expect(() => new Task({ id: 'x', description: 't', start: '09:00', end: '08:00' })).toThrow();
  });
});
