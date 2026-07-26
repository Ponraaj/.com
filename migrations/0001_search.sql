CREATE TABLE IF NOT EXISTS posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT NOT NULL,
  published_at TEXT NOT NULL
);

CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
  slug UNINDEXED,
  title,
  excerpt,
  body,
  tags,
  content='posts',
  content_rowid='rowid'
);
