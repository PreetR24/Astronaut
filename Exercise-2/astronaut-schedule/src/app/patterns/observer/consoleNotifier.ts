import { Notifier } from './notifier';
import { getLogger } from '../../logger/logger';

export class ConsoleNotifier implements Notifier {
  notify(event: string, payload?: any): void {
    const logger = getLogger();
    const msg = `[${event}] ${payload ? JSON.stringify(payload) : ''}`;
    console.log(msg);
    logger.info(msg);
  }
}
