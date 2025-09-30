import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(__dirname, '../../../data');
const TASK_FILE = path.join(DATA_DIR, 'tasks.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Dynamic import of supabase-backed persistence to avoid requiring the package when not used
async function getSupabasePersistence() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = await import('./persistenceService.supabase');
    return mod.SupabasePersistence;
  } catch (e) {
    return null;
  }
}

export class PersistenceService {
  static loadSync() {
    try {
      if (!fs.existsSync(TASK_FILE)) return null;
      const raw = fs.readFileSync(TASK_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      // If load fails, return null and let app start with empty state
      return null;
    }
  }

  static async loadAll() {
    if (process.env.STORAGE === 'supabase') {
      const SupabasePersistence = await getSupabasePersistence();
      if (!SupabasePersistence) throw new Error('SupabasePersistence not available');
      return SupabasePersistence.loadAll();
    }
    // Local file-based
    return this.loadSync();
  }

  static async saveWithRetry(obj: any, maxAttempts = 3) {
    if (process.env.STORAGE === 'supabase') {
      const SupabasePersistence = await getSupabasePersistence();
      if (!SupabasePersistence) throw new Error('SupabasePersistence not available');
      return SupabasePersistence.saveWithRetry(obj);
    }

    ensureDir();
    const data = JSON.stringify(obj, null, 2);
    let attempt = 0;
    let delay = 100;
    while (attempt < maxAttempts) {
      try {
        await fs.promises.writeFile(TASK_FILE, data, { encoding: 'utf8' });
        return true;
      } catch (err) {
        attempt++;
        if (attempt >= maxAttempts) throw err;
        // exponential backoff
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
      }
    }
    return false;
  }
}
