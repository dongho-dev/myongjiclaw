import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "myongjiclaw.db");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initTables(db);
  }
  return db;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      grade INTEGER NOT NULL CHECK(grade BETWEEN 1 AND 4),
      region TEXT NOT NULL,
      keywords TEXT NOT NULL DEFAULT '[]',
      discord_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      article_id TEXT NOT NULL,
      board_type TEXT NOT NULL,
      sent_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      UNIQUE(student_id, article_id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS timetables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      day TEXT NOT NULL CHECK(day IN ('mon','tue','wed','thu','fri')),
      period INTEGER NOT NULL,
      subject TEXT NOT NULL,
      professor TEXT,
      location TEXT,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS meal_cache (
      date TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      fetched_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
  `);
}

export interface Student {
  id: number;
  name: string;
  department: string;
  grade: number;
  region: string;
  keywords: string;
  discord_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  student_id: number;
  article_id: string;
  board_type: string;
  sent_at: string;
}

export interface TimetableEntry {
  id: number;
  student_id: number;
  day: string;
  period: number;
  subject: string;
  professor: string | null;
  location: string | null;
}

export default getDb;
