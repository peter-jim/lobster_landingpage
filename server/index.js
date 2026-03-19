const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// 简单管理密钥（部署时通过环境变量设置，默认值仅用于本地开发）
// ---------------------------------------------------------------------------
const ADMIN_KEY = process.env.ADMIN_KEY || 'openclaw-admin-2024';

// ---------------------------------------------------------------------------
// 数据库初始化
// ---------------------------------------------------------------------------
const db = new Database(path.join(__dirname, 'subscribers.db'));
db.pragma('journal_mode = WAL'); // 更好的并发性能

db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT    NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// ---------------------------------------------------------------------------
// 中间件
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// 简单的邮箱格式校验
// ---------------------------------------------------------------------------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------------------------------------------------------------------------
// POST /api/subscribe  —— 用户提交邮箱
// ---------------------------------------------------------------------------
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: '请提供邮箱地址' });
  }

  const trimmed = email.trim().toLowerCase();

  if (!isValidEmail(trimmed)) {
    return res.status(400).json({ success: false, message: '邮箱格式不正确' });
  }

  try {
    const stmt = db.prepare('INSERT INTO subscribers (email) VALUES (?)');
    stmt.run(trimmed);
    console.log(`[+] 新订阅: ${trimmed}`);
    return res.json({ success: true, message: '订阅成功！感谢您的关注 🦞' });
  } catch (err) {
    // UNIQUE 约束冲突 → 邮箱已存在
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.json({ success: true, message: '该邮箱已订阅，无需重复提交 😊' });
    }
    console.error('数据库写入失败:', err);
    return res.status(500).json({ success: false, message: '服务器错误，请稍后重试' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/subscribers  —— 查看已收集邮箱（需管理密钥）
// ---------------------------------------------------------------------------
app.get('/api/subscribers', (req, res) => {
  const key = req.query.key || req.headers['x-admin-key'];

  if (key !== ADMIN_KEY) {
    return res.status(401).json({ success: false, message: '未授权' });
  }

  try {
    const rows = db.prepare('SELECT id, email, created_at FROM subscribers ORDER BY id DESC').all();
    return res.json({ success: true, total: rows.length, data: rows });
  } catch (err) {
    console.error('查询失败:', err);
    return res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ---------------------------------------------------------------------------
// 健康检查
// ---------------------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// 启动服务
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🦞 OpenClaw 邮箱服务已启动: http://localhost:${PORT}`);
  console.log(`   POST /api/subscribe     — 提交邮箱`);
  console.log(`   GET  /api/subscribers    — 查看列表（需 key）`);
  console.log(`   GET  /api/health         — 健康检查`);
});
