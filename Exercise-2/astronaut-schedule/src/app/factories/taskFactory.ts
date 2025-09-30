import { v4 as uuidv4 } from 'uuid';
import { Task, Priority } from '../models/task';

export interface CreateTaskInput {
  description: string;
  start: string;
  end: string;
  priority?: Priority;
}

export class TaskFactory {
  static create(input: CreateTaskInput): Task {
    if (!input.description || input.description.trim().length === 0) {
      throw new Error('Description required');
    }
    const id = uuidv4();
    return new Task({
      id,
      description: input.description.trim(),
      start: input.start,
      end: input.end,
      priority: input.priority || 'Medium',
    });
  }
}
