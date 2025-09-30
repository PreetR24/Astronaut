import readline from 'readline';
import { scheduleController } from './app/controllers/scheduleController';
import { ConsoleNotifier } from './app/patterns/observer/consoleNotifier';
import { ScheduleManager } from './app/patterns/singleton/scheduleManager';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

// ensure persistence (Supabase) is initialized if configured
ScheduleManager.getInstanceAsync().then((manager) => {
  manager.registerNotifier(new ConsoleNotifier());
}).catch(() => {
  // ignore
});

console.log('Astronaut Schedule CLI — type "help" for commands');

rl.on('line', async (line: string) => {
  const input = (line || '').toString().trim();
  if (!input) return;
  const parts = input.match(/(?:".*?"|[^\s]+)+/g) || [];
  const args = parts.map((p: string) => p.replace(/^"|"$/g, ''));
  const cmd = args[0].toLowerCase();

  try {
    const shouldExit = await scheduleController(cmd, args.slice(1));
    if (shouldExit) {
      rl.close();
    }
  } catch (err: any) {
    console.error('Error:', err.message || err);
  }
});

rl.on('close', () => {
  console.log('Goodbye — exiting. Tasks are persisted to disk.');
  process.exit(0);
});
