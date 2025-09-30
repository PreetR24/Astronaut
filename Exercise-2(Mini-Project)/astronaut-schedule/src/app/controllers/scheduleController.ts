import { TaskFactory } from '../factories/taskFactory';
import { ScheduleManager } from '../patterns/singleton/scheduleManager';
import { getLogger } from '../logger/logger';

const manager = ScheduleManager.getInstance();

function parseEditFlags(args: string[]) {
  const updates: any = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--desc' && args[i + 1]) {
      updates.description = args[++i];
    } else if (a === '--start' && args[i + 1]) {
      updates.start = args[++i];
    } else if (a === '--end' && args[i + 1]) {
      updates.end = args[++i];
    } else if (a === '--priority' && args[i + 1]) {
      updates.priority = args[++i];
    }
  }
  return updates;
}

export async function scheduleController(cmd: string, args: string[]): Promise<boolean> {
  const logger = getLogger();
  switch (cmd) {
    case 'help':
      console.log('Commands:');
      console.log('  add "description" HH:mm HH:mm [High|Medium|Low]');
      console.log('  remove <id|description>');
      console.log('  view [--priority High|Medium|Low]');
      console.log('  edit <id> [--desc "..."] [--start HH:mm] [--end HH:mm] [--priority High]');
      console.log('  complete <id|description>');
      console.log('  help');
      console.log('  exit');
      break;

    case 'add': {
      const [description, start, end, priority] = args;
      if (!description || !start || !end) {
        console.error('Usage: add "description" HH:mm HH:mm [Priority]');
        break;
      }
      try {
        const task = TaskFactory.create({ description, start, end, priority: (priority as any) });
        await manager.addTask(task);
        console.log('Task added successfully. id=', task.id);
      } catch (err: any) {
        logger.warn(err.message || err);
        console.error('Error:', err.message || err);
      }
      break;
    }

    case 'view': {
      const flag = args[0];
      let tasks = manager.getAllTasks();
      if (flag === '--priority' && args[1]) {
        tasks = manager.getTasksByPriority(args[1] as any);
      }
      if (!tasks || tasks.length === 0) {
        console.log('No tasks scheduled for the day.');
      } else {
        for (const t of tasks) {
          console.log(`${t.start} - ${t.end}: ${t.description} [${t.priority}]${t.completed ? ' (Completed)' : ''} (id: ${t.id})`);
        }
      }
      break;
    }

    case 'remove': {
      const key = args.join(' ');
      if (!key) {
        console.error('Usage: remove <id|description>');
        break;
      }
      // try id first
      let ok = manager.removeTask(key);
      if (!ok) {
        // try by description (exact match or substring)
        const found = manager.getAllTasks().find(t => t.description === key || t.description.includes(key));
        if (found) ok = manager.removeTask(found.id);
      }
      console.log(ok ? 'Task removed successfully.' : 'Error: Task not found.');
      break;
    }

    case 'edit': {
      const id = args[0];
      if (!id) {
        console.error('Usage: edit <id> [--desc "..."] [--start HH:mm] [--end HH:mm] [--priority <level>]');
        break;
      }
      const updates = parseEditFlags(args.slice(1));
      const ok = manager.editTask(id, updates);
      console.log(ok ? 'Task updated successfully.' : 'Error: Could not update task (conflict or invalid data).');
      break;
    }

    case 'complete': {
      const key = args.join(' ');
      if (!key) {
        console.error('Usage: complete <id|description>');
        break;
      }
      let ok = manager.markComplete(key);
      if (!ok) {
        const found = manager.getAllTasks().find(t => t.description === key || t.description.includes(key));
        if (found) ok = manager.markComplete(found.id);
      }
      console.log(ok ? 'Task marked as completed.' : 'Error: Task not found.');
      break;
    }

    case 'exit':
      return true;

    default:
      console.log('Unknown command. Type help');
  }
  return false;
}

export const scheduleControllerDefault = scheduleController;
