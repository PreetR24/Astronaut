export interface Notifier {
  notify(event: string, payload?: any): void;
}
