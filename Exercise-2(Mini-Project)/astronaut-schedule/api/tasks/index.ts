import type { VercelRequest, VercelResponse } from '@vercel/node';
import { TaskFactory } from '../../src/app/factories/taskFactory';
import { ScheduleManager } from '../../src/app/patterns/singleton/scheduleManager';

export default async (req: VercelRequest, res: VercelResponse) => {
  const manager = await ScheduleManager.getInstanceAsync();

  try {
    if (req.method === 'GET') {
      const tasks = manager.getAllTasks();
      return res.status(200).json(tasks);
    }

    if (req.method === 'POST') {
      const { description, start, end, priority } = req.body;
      const task = TaskFactory.create({ description, start, end, priority });
      await manager.addTask(task);
      return res.status(201).json(task);
    }

    res.status(405).send('Method Not Allowed');
  } catch (err: any) {
    res.status(400).json({ error: err.message || String(err) });
  }
};
