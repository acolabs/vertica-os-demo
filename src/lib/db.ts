import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dataDir = path.join(process.cwd(), 'data');
    const dbPath = path.join(dataDir, 'vertica.db');

    if (process.env.VERCEL) {
      // On Vercel, filesystem is read-only — copy DB to /tmp for WAL support
      const tmpPath = '/tmp/vertica.db';
      if (!fs.existsSync(tmpPath)) {
        fs.copyFileSync(dbPath, tmpPath);
      }
      db = new Database(tmpPath);
    } else {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      db = new Database(dbPath);
    }
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}
