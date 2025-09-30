import { ScheduleManager } from '../app/patterns/singleton/scheduleManager';
import { TaskFactory } from '../app/factories/taskFactory';

describe('ScheduleManager', () => {
  let manager: ScheduleManager;

  beforeEach(() => {
    manager = ScheduleManager.getInstance();
    // clear internal map via remove of all tasks
    for (const t of manager.getAllTasks()) {
      manager.removeTask(t.id);
    }
  });

  test('add and view task', async () => {
    const t = TaskFactory.create({ description: 'A', start: '06:00', end: '07:00', priority: 'Low' });
    await manager.addTask(t);
    const all = manager.getAllTasks();
    expect(all.length).toBe(1);
    expect(all[0].description).toBe('A');
  });

  test('detect conflict', async () => {
    const t1 = TaskFactory.create({ description: 'A', start: '09:00', end: '10:00' });
    await manager.addTask(t1);
    const t2 = TaskFactory.create({ description: 'B', start: '09:30', end: '10:30' });
    await expect(manager.addTask(t2)).rejects.toThrow(/conflicts/);
  });

  test('remove task', async () => {
    const t = TaskFactory.create({ description: 'X', start: '11:00', end: '12:00' });
    await manager.addTask(t);
    const ok = manager.removeTask(t.id);
    expect(ok).toBe(true);
  });

  test('edit task with conflict denied', async () => {
    const t1 = TaskFactory.create({ description: 'A', start: '13:00', end: '14:00' });
    const t2 = TaskFactory.create({ description: 'B', start: '14:00', end: '15:00' });
    await manager.addTask(t1);
    await manager.addTask(t2);
    const ok = manager.editTask(t2.id, { start: '13:30', end: '14:30' } as any);
    expect(ok).toBe(false);
  });

  test('mark complete and filter by priority', async () => {
    const t = TaskFactory.create({ description: 'C', start: '16:00', end: '17:00', priority: 'High' });
    await manager.addTask(t);
    const ok = manager.markComplete(t.id);
    expect(ok).toBe(true);
    const high = manager.getTasksByPriority('High');
    expect(high.some(x => x.id === t.id)).toBe(true);
  });
});
