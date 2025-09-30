import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ScheduleManager } from '../../src/app/patterns/singleton/scheduleManager';

export default async (req: VercelRequest, res: VercelResponse) => {
  const manager = await ScheduleManager.getInstanceAsync();
  const id = req.query.id as string;

  try {
    if (req.method === 'PUT') {
      const updates = req.body;
      const ok = manager.editTask(id, updates as any);
      return res.status(ok ? 200 : 409).json({ ok });
    }

    if (req.method === 'DELETE') {
      const ok = manager.removeTask(id);
      return res.status(ok ? 200 : 404).json({ ok });
    }

    res.status(405).send('Method Not Allowed');
  } catch (err: any) {
    res.status(400).json({ error: err.message || String(err) });
  }
};
