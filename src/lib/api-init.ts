import { initializeDatabase } from './schema';

let initialized = false;

export function ensureDbInitialized(): void {
  if (!initialized) {
    initializeDatabase();
    initialized = true;
  }
}
