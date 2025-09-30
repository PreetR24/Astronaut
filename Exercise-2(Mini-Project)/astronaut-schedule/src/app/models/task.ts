import { minutesSinceMidnight } from '../utils/timeUtils';

export type Priority = 'High' | 'Medium' | 'Low';

export class Task {
  id: string;
  description: string;
  start: string; // HH:mm
  end: string; // HH:mm
  priority: Priority;
  completed: boolean;

  constructor(props: {
    id: string;
    description: string;
    start: string;
    end: string;
    priority?: Priority;
    completed?: boolean;
  }) {
    this.id = props.id;
    this.description = props.description;
    this.start = props.start;
    this.end = props.end;
    this.priority = props.priority || 'Medium';
    this.completed = props.completed || false;

    if (!Task.validateTimeFormat(this.start) || !Task.validateTimeFormat(this.end)) {
      throw new Error('Invalid time format; expected HH:mm');
    }
    if (Task.parseTimeToMinutes(this.start) >= Task.parseTimeToMinutes(this.end)) {
      throw new Error('Start time must be before end time');
    }
  }

  static validateTimeFormat(time: string): boolean {
    if (!/^\d{2}:\d{2}$/.test(time)) return false;
    const [hhStr, mmStr] = time.split(':');
    const hh = parseInt(hhStr, 10);
    const mm = parseInt(mmStr, 10);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return false;
    if (hh < 0 || hh > 23) return false;
    if (mm < 0 || mm > 59) return false;
    return true;
  }

  static parseTimeToMinutes(time: string): number {
    return minutesSinceMidnight(time);
  }
}
