import { TaskFactory } from '../app/factories/taskFactory';
import { ScheduleManager } from '../app/patterns/singleton/scheduleManager';

describe('Edge cases and validations', () => {
  let manager: ScheduleManager;
  beforeEach(() => {
    manager = ScheduleManager.getInstance();
    // clear existing tasks
    for (const t of manager.getAllTasks()) manager.removeTask(t.id);
  });

  test('factory rejects invalid hour like 25:00', () => {
    expect(() => TaskFactory.create({ description: 'Bad', start: '25:00', end: '26:00' })).toThrow(/Invalid time/);
  });

  test('factory rejects invalid minute like 09:60', () => {
    expect(() => TaskFactory.create({ description: 'Bad', start: '09:60', end: '10:00' })).toThrow(/Invalid time/);
  });

  test('cannot add overlapping tasks via edit', async () => {
    const t1 = TaskFactory.create({ description: 'A', start: '10:00', end: '11:00' });
    const t2 = TaskFactory.create({ description: 'B', start: '11:00', end: '12:00' });
    await manager.addTask(t1);
    await manager.addTask(t2);
    // editing t2 to overlap with t1
    const ok = manager.editTask(t2.id, { start: '10:30', end: '11:30' } as any);
    expect(ok).toBe(false);
  });

  test('remove non-existent task returns false', () => {
    const ok = manager.removeTask('no-such-id');
    expect(ok).toBe(false);
  });

  test('mark complete by description works', async () => {
    const t = TaskFactory.create({ description: 'CompleteMe', start: '14:00', end: '15:00' });
    await manager.addTask(t);
    // mark by description via find
    const found = manager.getAllTasks().find(x => x.description === 'CompleteMe');
    expect(found).toBeDefined();
    const ok = manager.markComplete(found!.id);
    expect(ok).toBe(true);
    const updated = manager.getAllTasks().find(x => x.id === found!.id);
    expect(updated!.completed).toBe(true);
  });

  test('view empty returns empty list', () => {
    const all = manager.getAllTasks();
    expect(all.length).toBe(0);
  });
});
