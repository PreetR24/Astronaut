import { TaskFactory } from './app/factories/taskFactory';
import { ScheduleManager } from './app/patterns/singleton/scheduleManager';
import { ConsoleNotifier } from './app/patterns/observer/consoleNotifier';

async function run() {
  const manager = ScheduleManager.getInstance();
  manager.registerNotifier(new ConsoleNotifier());

  console.log('--- Smoke test start ---');

  try {
    const t1 = TaskFactory.create({ description: 'Morning Exercise', start: '07:00', end: '08:00', priority: 'High' });
    await manager.addTask(t1);
    console.log('Added task1 id=', t1.id);

    // conflicting task
    const t2 = TaskFactory.create({ description: 'Breakfast', start: '07:30', end: '07:45', priority: 'Low' });
    try {
      await manager.addTask(t2);
      console.log('Added task2 id=', t2.id);
    } catch (err: any) {
      console.log('Expected conflict when adding t2:', err.message || err);
    }

    console.log('All tasks:');
    console.table(manager.getAllTasks().map(t => ({ id: t.id, desc: t.description, start: t.start, end: t.end, priority: t.priority, completed: t.completed })));

    // mark complete
    const id = manager.getAllTasks()[0]?.id;
    if (id) {
      manager.markComplete(id);
      console.log('Marked complete:', id);
    }

    console.log('After completion:');
    console.table(manager.getAllTasks().map(t => ({ id: t.id, desc: t.description, completed: t.completed })));

    if (id) {
      manager.removeTask(id);
      console.log('Removed:', id);
    }

    console.log('Final tasks:');
    console.table(manager.getAllTasks().map(t => ({ id: t.id, desc: t.description })));

  } catch (err) {
    console.error('Smoke test error:', err);
  }

  console.log('--- Smoke test end ---');
}

run();
