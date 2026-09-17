const path = require("path");
const Database = require("better-sqlite3");

const db = new Database(path.join(__dirname, "dashboard.db"));
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS channel_counts (
  channel_id TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS flags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  author_tag TEXT NOT NULL,
  content TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_count INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

function bumpChannelCount(channelId) {
  db.prepare(
    `INSERT INTO channel_counts (channel_id, count) VALUES (?, 1)
     ON CONFLICT(channel_id) DO UPDATE SET count = count + 1`
  ).run(channelId);
}

function getChannelCounts() {
  const rows = db.prepare(`SELECT channel_id, count FROM channel_counts`).all();
  const map = {};
  rows.forEach((r) => { map[r.channel_id] = r.count; });
  return map;
}

function addFlag({ channelId, messageId, authorTag, content, reason }) {
  db.prepare(
    `INSERT INTO flags (channel_id, message_id, author_tag, content, reason) VALUES (?, ?, ?, ?, ?)`
  ).run(channelId, messageId, authorTag, content, reason);
}

function getPendingFlags() {
  return db.prepare(
    `SELECT id, channel_id, message_id, author_tag, content, reason, created_at
     FROM flags WHERE status = 'pending' ORDER BY id DESC LIMIT 50`
  ).all();
}

function resolveFlag(id, action) {
  db.prepare(`UPDATE flags SET status = ? WHERE id = ?`).run(action === "approve" ? "approved" : "removed", id);
}

function addActivity(type, text) {
  db.prepare(`INSERT INTO activity (type, text) VALUES (?, ?)`).run(type, text);
  db.prepare(
    `DELETE FROM activity WHERE id NOT IN (SELECT id FROM activity ORDER BY id DESC LIMIT 200)`
  ).run();
}

function getActivity(limit) {
  return db.prepare(`SELECT type, text, created_at FROM activity ORDER BY id DESC LIMIT ?`).all(limit || 30);
}

function addSnapshot(memberCount) {
  db.prepare(`INSERT INTO snapshots (member_count) VALUES (?)`).run(memberCount);
}

function getSnapshots(limit) {
  const rows = db.prepare(`SELECT member_count, created_at FROM snapshots ORDER BY id DESC LIMIT ?`).all(limit || 30);
  return rows.reverse();
}

module.exports = {
  bumpChannelCount,
  getChannelCounts,
  addFlag,
  getPendingFlags,
  resolveFlag,
  addActivity,
  getActivity,
  addSnapshot,
  getSnapshots,
};
