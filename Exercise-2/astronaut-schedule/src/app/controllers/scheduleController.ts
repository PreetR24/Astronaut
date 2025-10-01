import { TaskFactory } from '../factories/taskFactory';
import { ScheduleManager } from '../patterns/singleton/scheduleManager';
import { getLogger } from '../logger/logger';
import { Priority } from '../models/task';

// Define the expected return type for the frontend
export type ControllerResult = {
    success: boolean;
    message?: string;
    error?: string;
};

const manager = ScheduleManager.getInstance();
const logger = getLogger();

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

/**
 * Handles all CLI commands and returns a structured result for the browser UI.
 */
export async function scheduleController(cmd: string, args: string[]): Promise<ControllerResult> {
    
    // Commands that return true for the old structure now return a specific exit message
    if (cmd === 'exit') {
        return { success: true, message: 'Exiting CLI session...' };
    }

    switch (cmd) {
        case 'help': {
            const helpText = `
Available Commands:
-------------------
 add "description" HH:mm HH:mm [High|Medium|Low]
 remove <id|description>
 view [--priority High|Medium|Low]
 edit <id> [--desc "..."] [--start HH:mm] [--end HH:mm] [--priority High]
 complete <id|description>
 help: Shows this help message.
 exit: Ends the current CLI session.
 clear: Clears the console display.
`;
            return { success: true, message: helpText };
        }

        case 'add': {
            const [description, start, end, priorityArg] = args;
            if (!description || !start || !end) {
                return { success: false, error: 'Usage: add "description" HH:mm HH:mm [priority]' };
            }
            try {
                const normalizedPriority = priorityArg ? priorityArg.toLowerCase() : 'medium';
                const validPriorities = ['high', 'medium', 'low'];

                if (!validPriorities.includes(normalizedPriority)) {
                    return { success: false, error: `Invalid priority "${priorityArg}". Use high, medium, or low.` };
                }

                const task = TaskFactory.create({ 
                    description, 
                    start, 
                    end, 
                    priority: normalizedPriority as Priority 
                });

                await manager.addTask(task);
                return { success: true, message: `✅ Task added successfully. ID: ${task.id} (${description})` };
            } catch (err: any) {
                logger.warn(`ADD Error: ${err.message || err}`);
                return { success: false, error: `Error adding task: ${err.message || 'Invalid task data.'}` };
            }
        }

        case 'view': {
            let tasks = manager.getAllTasks();

            if (args.length > 0) {
                const priorityArg = args[0].toLowerCase();
                const validPriorities: Priority[] = ['high', 'medium', 'low'];

                if (validPriorities.includes(priorityArg as Priority)) {
                    tasks = manager.getTasksByPriority(priorityArg as Priority);
                    if (tasks.length === 0) {
                        return { success: true, message: `No tasks found with priority: ${priorityArg}.` };
                    }
                } else {
                    return { success: false, error: `Invalid priority "${priorityArg}". Use high, medium, or low.` };
                }
            }

            if (!tasks || tasks.length === 0) {
                return { success: true, message: 'No tasks scheduled for the day. Schedule is clear! 🚀' };
            } else {
                const output = tasks
                    .map(t => {
                        const status = t.completed ? '✅ (Completed)' : '⏳ (Pending)';
                        return `ID: ${t.id.toString().padEnd(3)} | ${t.start} - ${t.end} | [${t.priority.padEnd(6)}] | ${t.description} ${status}`;
                    })
                    .join('\n');

                return { success: true, message: `--- Daily Schedule ---\n${output}\n----------------------` };
            }
        }

        case 'remove': {
            const key = args.join(' ');
            if (!key) {
                return { success: false, error: 'Usage: remove <id|description>' };
            }
            
            let ok = manager.removeTask(key);
            let removedDescription = '';
            
            if (!ok) {
                const found = manager.getAllTasks().find(t => t.description === key || t.description.includes(key));
                if (found) {
                    ok = manager.removeTask(found.id);
                    removedDescription = found.description;
                }
            }
            
            return ok 
                ? { success: true, message: `🗑️ Task removed successfully: ${removedDescription || key}.` }
                : { success: false, error: `Error: Task not found by ID or description: "${key}".` };
        }

        case 'edit': {
            const id = args[0];
            if (!id) {
                return { success: false, error: 'Usage: edit <id> [--desc "..."] [--start HH:mm] [--end HH:mm] [--priority <level>]' };
            }
            const updates = parseEditFlags(args.slice(1));
            
            if (Object.keys(updates).length === 0) {
                 return { success: false, error: 'No update flags provided. Use --desc, --start, --end, or --priority.' };
            }

            const ok = manager.editTask(id, updates);
            return ok 
                ? { success: true, message: `📝 Task ${id} updated successfully.` } 
                : { success: false, error: 'Error: Could not update task. Check ID, task conflict, or invalid data.' };
        }

        case 'complete': {
            const key = args.join(' ');
            if (!key) {
                return { success: false, error: 'Usage: complete <id|description>' };
            }
            
            let ok = manager.markComplete(key);
            let completedDescription = '';
            
            if (!ok) {
                const found = manager.getAllTasks().find(t => t.description === key || t.description.includes(key));
                if (found) {
                    ok = manager.markComplete(found.id);
                    completedDescription = found.description;
                }
            }
            
            return ok 
                ? { success: true, message: `✅ Task marked as completed: ${completedDescription || key}.` } 
                : { success: false, error: `Error: Task not found by ID or description: "${key}".` };
        }

        default:
            return { success: false, error: `Unknown command: "${cmd}". Type help` };
    }
}

export const scheduleControllerDefault = scheduleController;