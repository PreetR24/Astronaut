import { Task } from '../../models/task';
import { ValidationService } from '../../services/validationService';
import { Notifier } from '../observer/notifier';
import { getLogger } from '../../logger/logger';
import { PersistenceService } from '../../services/persistenceService';

export class ScheduleManager {
    private static instance: ScheduleManager;
    private tasks: Map<string, Task> = new Map();
    private notifiers: Set<Notifier> = new Set();

    private constructor() {}

    static getInstance(): ScheduleManager {
        if (!ScheduleManager.instance) ScheduleManager.instance = new ScheduleManager();
        try {
            const loaded = PersistenceService.loadSync();
            if (loaded && loaded.tasks) {
                for (const t of loaded.tasks) {
                    ScheduleManager.instance.tasks.set(t.id, t as Task);
                }
            }
        } catch (e) {
            // ignore
        }
        return ScheduleManager.instance;
    }

    static async getInstanceAsync(): Promise<ScheduleManager> {
        return this.getInstance();
    }

    registerNotifier(n: Notifier) {
        this.notifiers.add(n);
    }

    unregisterNotifier(n: Notifier) {
        this.notifiers.delete(n);
    }

    private notify(event: string, payload?: any) {
        this.notifiers.forEach((n) => n.notify(event, payload));
    }

    async addTask(task: Task): Promise<void> {
        const logger = getLogger();
        const conflict = ValidationService.detectOverlap(task, Array.from(this.tasks.values()));
        if (conflict) {
            this.notify('task_conflict', { task, conflict });
            logger.warn(`Conflict adding task ${task.id} with ${conflict.id}`);
            throw new Error(`Task conflicts with existing task: ${conflict.description}`);
        }
        this.tasks.set(task.id, task);
            // persist
            try {
                await PersistenceService.saveWithRetry({ tasks: Array.from(this.tasks.values()) });
            } catch (err) {
                logger.warn('Failed to persist tasks after add', err);
            }
        this.notify('task_added', task);
        logger.info(`Task added: ${task.id}`);
    }

    removeTask(id: string): boolean {
        const existed = this.tasks.delete(id);
        if (existed) {
            this.notify('task_removed', { id });
                getLogger().info(`Task removed: ${id}`);
                // persist
                PersistenceService.saveWithRetry({ tasks: Array.from(this.tasks.values()) }).catch((e) => getLogger().warn('Failed to persist after remove', e));
        }
        return existed;
    }

    editTask(id: string, updates: Partial<Task>): boolean {
        const t = this.tasks.get(id);
        if (!t) return false;
        const merged: Task = {
            ...t,
            ...updates,
        } as Task;
        // revalidate times
        try {
            if (!Task.validateTimeFormat(merged.start) || !Task.validateTimeFormat(merged.end)) {
                return false;
            }
            if (Task.parseTimeToMinutes(merged.start) >= Task.parseTimeToMinutes(merged.end)) return false;
        } catch (err) {
            return false;
        }
        const conflict = ValidationService.detectOverlap(merged, Array.from(this.tasks.values()));
        if (conflict) {
            this.notify('task_conflict', { updated: merged, conflict });
            return false;
        }
        this.tasks.set(id, merged);
            this.notify('task_edited', { id, updates });
            getLogger().info(`Task edited: ${id}`);
            PersistenceService.saveWithRetry({ tasks: Array.from(this.tasks.values()) }).catch((e) => getLogger().warn('Failed to persist after edit', e));
        return true;
    }

    markComplete(id: string): boolean {
        const t = this.tasks.get(id);
        if (!t) return false;
        t.completed = true;
        this.tasks.set(id, t);
        this.notify('task_completed', { id });
            getLogger().info(`Task completed: ${id}`);
            PersistenceService.saveWithRetry({ tasks: Array.from(this.tasks.values()) }).catch((e) => getLogger().warn('Failed to persist after complete', e));
        return true;
    }

    getAllTasks(): Task[] {
        return Array.from(this.tasks.values()).sort((a, b) => {
            const pa = Task.parseTimeToMinutes(a.start);
            const pb = Task.parseTimeToMinutes(b.start);
            return pa - pb;
        });
    }

    getTasksByPriority(priority: Task['priority']): Task[] {
        return this.getAllTasks().filter((t) => t.priority === priority);
    }
}
