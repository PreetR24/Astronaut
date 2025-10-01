import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(__dirname, '../../../data');
const TASK_FILE = path.join(DATA_DIR, 'tasks.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
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
    return this.loadSync();
  }

  static async saveWithRetry(obj: any, maxAttempts = 3) {
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
