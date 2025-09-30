import { Task } from '../models/task';
import { overlaps } from '../utils/timeUtils';

export class ValidationService {
  static detectOverlap(task: Task, others: Task[]): Task | null {
    for (const t of others) {
      if (t.id === task.id) continue;
      if (overlaps(task.start, task.end, t.start, t.end)) return t;
    }
    return null;
  }
}
