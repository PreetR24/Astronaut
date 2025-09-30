import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // don't throw at import time; allow local dev without supabase configured
    console.warn('Supabase URL or KEY not set; SupabasePersistence will not function');
}

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

export class SupabasePersistence {
  static async saveWithRetry(obj: any) {
    if (!supabase) throw new Error('Supabase not configured');
    // obj is expected { tasks: Task[] }
    const tasks = obj.tasks || [];
    // upsert all tasks
    // supabase table: tasks with columns id, description, start_time, end_time, priority, completed
    const rows = tasks.map((t: any) => ({
      id: t.id,
      description: t.description,
      start_time: t.start,
      end_time: t.end,
      priority: t.priority,
      completed: t.completed,
    }));
    const { error } = await supabase.from('tasks').upsert(rows, { onConflict: 'id' });
    if (error) throw error;
    return true;
  }

  static async loadAll() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) throw error;
    // map DB rows to Task shape expected by the app: { id, description, start, end, priority, completed }
    const tasks = (data || []).map((r: any) => ({
      id: r.id,
      description: r.description,
      start: r.start_time ?? r.start,
      end: r.end_time ?? r.end,
      priority: r.priority,
      completed: !!r.completed,
    }));
    return { tasks };
  }
}
