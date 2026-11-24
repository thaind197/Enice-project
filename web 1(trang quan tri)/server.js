// WEB 1 (trang quản trị) — CHỈ 1 tài khoản do bạn tạo sẵn, không có đăng ký công khai.
// Cài: npm i express
// Lần chạy đầu cần ADMIN_USER và ADMIN_PASS để tạo tài khoản (sau đó lưu băm trong users.json, có thể bỏ 2 biến này):
//   set WEB2_URL=http://localhost:3001 & set WEB2_KEY=chuoi-bi-mat
//   set ADMIN_USER=quantri & set ADMIN_PASS=MatKhau2026
//   node server.js
// Quên mật khẩu: tắt server, xóa users.json, chạy lại với ADMIN_USER / ADMIN_PASS mới.
const express = require('express'), crypto = require('crypto'), fs = require('fs'), path = require('path'), { promisify } = require('util');
try { require('dotenv').config({ path: path.join(__dirname, '.env') }); } catch {}   // đọc file .env nếu có (không bắt buộc)
const scrypt = promisify(crypto.scrypt);
const { WEB2_URL, WEB2_KEY, ADMIN_USER, ADMIN_PASS } = process.env;
if (!WEB2_URL || !WEB2_KEY) throw new Error('Thiếu WEB2_URL hoặc WEB2_KEY');
 
const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY) app.set('trust proxy', 1);   // đặt khi chạy sau nginx/hosting có HTTPS
const USERS = path.join(__dirname, 'users.json'), COOKIE = 'enice_sid', IDLE = 2 * 3600e3, ABS = 12 * 3600e3;
 
// ---------- tài khoản duy nhất (mật khẩu băm bằng scrypt) ----------
const getUser = () => { try { const u = JSON.parse(fs.readFileSync(USERS, 'utf8')); return u && u.username && u.pw ? u : null; } catch { return null; } };
const setUser = u => { fs.writeFileSync(USERS + '.tmp', JSON.stringify(u), { mode: 0o600 }); fs.renameSync(USERS + '.tmp', USERS); };
const hashPw = async pw => { const salt = crypto.randomBytes(16); return salt.toString('hex') + ':' + (await scrypt(pw, salt, 64)).toString('hex'); };
const checkPw = async (pw, st) => { const [s, h] = st.split(':'); return crypto.timingSafeEqual(await scrypt(pw, Buffer.from(s, 'hex'), 64), Buffer.from(h, 'hex')); };
const sha = v => crypto.createHash('sha256').update(String(v)).digest();
const same = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));
const userErr = n => /^[A-Za-z0-9._@-]{3,40}$/.test(n || '') ? null : 'Tên đăng nhập 3-40 ký tự: chữ không dấu, số, và . _ - @';
const pwErr = p => typeof p !== 'string' || p.length < 8 || p.length > 128 || !/[A-Za-z]/.test(p) || !/\d/.test(p) ? 'Mật khẩu cần 8-128 ký tự, gồm cả chữ và số.' : null;
 
// ---------- chống thử mật khẩu ----------
const hits = new Map();
const limited = (k, max, ms) => { const now = Date.now(), a = (hits.get(k) || []).filter(t => now - t < ms); a.push(now); hits.set(k, a); return a.length > max; };
 
// ---------- phiên đăng nhập: cookie phiên (không có Max-Age), HttpOnly, SameSite=Strict, lưu ở server ----------
const sessions = new Map();
const sidOf = q => ((q.headers.cookie || '').split(/;\s*/).find(c => c.startsWith(COOKIE + '=')) || '').slice(COOKIE.length + 1);
const sess = q => { const id = sidOf(q), s = sessions.get(id), n = Date.now(); if (!s || n - s.last > IDLE || n > s.abs) { sessions.delete(id); return null; } s.last = n; return s; };
const flags = q => 'Path=/; HttpOnly; SameSite=Strict' + (q.secure ? '; Secure' : '');
const startSession = (q, s) => {
  sessions.delete(sidOf(q));                                 // đổi mã phiên mỗi lần đăng nhập
  const id = crypto.randomBytes(32).toString('hex'), n = Date.now();
  sessions.set(id, { last: n, abs: n + ABS }); s.setHeader('Set-Cookie', `${COOKIE}=${id}; ${flags(q)}`);
};
const endSession = (q, s) => {                               // đăng xuất: hủy phiên ở server + xóa cookie + xóa cache trang
  sessions.delete(sidOf(q));
  s.setHeader('Set-Cookie', `${COOKIE}=; ${flags(q)}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  s.setHeader('Clear-Site-Data', '"cache"');
};
const need = (q, s, n) => sess(q) ? n() : s.status(401).json({ error: 'Chưa đăng nhập' });
setInterval(() => { const n = Date.now(); for (const [k, v] of sessions) if (n > v.abs || n - v.last > IDLE) sessions.delete(k); hits.clear(); }, 10 * 60e3).unref();
 
// ---------- bảo vệ chung ----------
app.use((q, s, n) => {
  s.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'same-origin' });
  if (!['GET', 'HEAD', 'OPTIONS'].includes(q.method) && q.headers.origin) {     // chặn gửi lệnh từ trang web khác
    try { if (new URL(q.headers.origin).host !== q.headers.host) return s.status(403).json({ error: 'Nguồn gửi không hợp lệ' }); }
    catch { return s.status(403).json({ error: 'Nguồn gửi không hợp lệ' }); }
  }
  if (q.path.startsWith('/auth') || q.path.startsWith('/api')) s.set('Cache-Control', 'no-store');
  n();
});
const h = fn => (q, s) => fn(q, s).catch(e => { console.error(e); s.status(500).json({ error: 'Lỗi máy chủ, thử lại sau.' }); });
const page = f => (q, s) => { s.set('Cache-Control', 'no-store'); s.sendFile(path.join(__dirname, 'public', f)); };
const bad = (s, m, c = 400) => s.status(c).json({ error: m });
 
app.get('/login', (q, s) => sess(q) ? s.redirect('/') : page('login.html')(q, s));
app.get('/', (q, s) => sess(q) ? page('index.html')(q, s) : s.redirect('/login'));
 
const A = express.Router();
A.use(express.json({ limit: '10kb' }));
A.get('/state', (q, s) => s.json({ loggedIn: !!sess(q) }));
A.post('/login', h(async (q, s) => {
  if (limited(q.ip + 'login', 15, 15 * 60e3)) return bad(s, 'Đăng nhập sai quá nhiều lần. Hãy đợi 15 phút.', 429);
  const u = getUser(), name = String(q.body.username || ''), pw = String(q.body.password || '');
  const pwOk = await checkPw(pw, u.pw), nameOk = same(name, u.username);
  if (!(pwOk && nameOk)) return bad(s, 'Tên đăng nhập hoặc mật khẩu không đúng.', 401);
  startSession(q, s); s.json({ ok: true });
}));
A.post('/logout', (q, s) => { endSession(q, s); s.json({ ok: true }); });
A.get('/me', need, (q, s) => s.json({ username: getUser().username }));
A.post('/profile', need, h(async (q, s) => {                    // đổi tên đăng nhập (phải nhập mật khẩu hiện tại)
  if (limited(q.ip + 'pw', 10, 15 * 60e3)) return bad(s, 'Thử quá nhiều lần. Hãy đợi 15 phút.', 429);
  const u = getUser(), name = String(q.body.username || '').trim();
  if (!(await checkPw(String(q.body.current || ''), u.pw))) return bad(s, 'Mật khẩu hiện tại không đúng.');
  const e = userErr(name); if (e) return bad(s, e);
  u.username = name; setUser(u); s.json({ username: name });
}));
A.post('/password', need, h(async (q, s) => {
  if (limited(q.ip + 'pw', 10, 15 * 60e3)) return bad(s, 'Thử quá nhiều lần. Hãy đợi 15 phút.', 429);
  const u = getUser();
  if (!(await checkPw(String(q.body.current || ''), u.pw))) return bad(s, 'Mật khẩu hiện tại không đúng.');
  const e = pwErr(q.body.password); if (e) return bad(s, e);
  if (q.body.password === q.body.current) return bad(s, 'Mật khẩu mới phải khác mật khẩu hiện tại.');
  u.pw = await hashPw(q.body.password); setUser(u);
  sessions.clear(); startSession(q, s); s.json({ ok: true });     // đăng xuất mọi nơi khác, giữ phiên này
}));
app.use('/auth', A);
 
// Chuyển tiếp sang web 2 (kèm API key, chỉ khi đã đăng nhập; cookie của bạn không bao giờ gửi sang web 2)
app.use('/api', need, async (q, s) => {
  try {
    const ct = q.headers['content-type'];
    const r = await fetch(WEB2_URL + q.originalUrl, { method: q.method, headers: { 'x-api-key': WEB2_KEY, ...(ct && { 'content-type': ct }) },
      body: ['GET', 'HEAD'].includes(q.method) ? undefined : q, duplex: 'half' });
    if (r.status === 401) return s.status(502).json({ error: 'Web 2 từ chối API key. Hãy để WEB2_KEY (web 1) trùng API_KEY (web 2).' });
    s.status(r.status).type(r.headers.get('content-type') || 'json').send(Buffer.from(await r.arrayBuffer()));
  } catch { s.status(502).json({ error: 'Không kết nối được web 2' }); }
});
 
(async () => {
  if (!getUser()) {                                           // lần chạy đầu: tạo tài khoản duy nhất từ biến môi trường
    if (!ADMIN_USER || !ADMIN_PASS) { console.error('Lần chạy đầu cần đặt ADMIN_USER và ADMIN_PASS để tạo tài khoản quản trị.'); process.exit(1); }
    const e = userErr(ADMIN_USER) || pwErr(ADMIN_PASS); if (e) { console.error(e); process.exit(1); }
    setUser({ username: ADMIN_USER, pw: await hashPw(ADMIN_PASS) }); console.log('Đã tạo tài khoản quản trị: ' + ADMIN_USER);
  }
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log('Web 1 đang chạy: http://localhost:' + port));
})().catch(e => { console.error(e); process.exit(1); });
 