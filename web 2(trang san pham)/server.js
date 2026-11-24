// WEB 2 (enice.vn). Cấu trúc: server.js, public/ (index.html, products.js, key/), trash.json, promotions.json, visits.json (tự tạo)
// Cài: npm i express multer   |   Chạy: API_KEY=chuoi-bi-mat node server.js
const express = require('express'), multer = require('multer'), fs = require('fs'), vm = require('vm'), path = require('path'), crypto = require('crypto');
try { require('dotenv').config({ path: path.join(__dirname, '.env') }); } catch {}   // đọc file .env nếu có (không bắt buộc)
const app = express();
if (process.env.TRUST_PROXY) app.set('trust proxy', 1);
const P = path.join(__dirname, 'public', 'products.js'), T = path.join(__dirname, 'trash.json'), KEY = process.env.API_KEY;
if (!KEY) throw new Error('Thiếu API_KEY');
// Tự tạo thư mục/file còn thiếu để chạy được trên máy mới
fs.mkdirSync(path.join(__dirname, 'public', 'key'), { recursive: true });
if (!fs.existsSync(P)) fs.writeFileSync(P, 'window.products = [];');
// Ghi file an toàn: ghi ra file tạm rồi đổi tên, tránh hỏng dữ liệu nếu máy tắt giữa chừng
const writeFile = (f, d) => { fs.writeFileSync(f + '.tmp', d); fs.renameSync(f + '.tmp', f); };
 
const load = () => { const c = { window: {} }; vm.runInNewContext(fs.readFileSync(P, 'utf8'), c); return c.window.products; };
const save = l => { fs.copyFileSync(P, path.join(__dirname, 'products.bak.js')); writeFile(P, 'window.products = ' + JSON.stringify(l, null, 2) + ';'); };
const trash = () => fs.existsSync(T) ? JSON.parse(fs.readFileSync(T, 'utf8')) : [];
const saveT = l => writeFile(T, JSON.stringify(l));
const clean = v => String(v ?? '').replace(/[<>"`]/g, '').trim();   // landing page chèn thẳng vào HTML nên loại ký tự nguy hiểm
const pick = b => ({
  name: clean(b.name), price: +b.price || 0, salePrice: +b.salePrice || 0,
  brand: clean(b.brand), rating: +b.rating || 5, isTopseller: !!b.isTopseller, hidden: !!b.hidden,
  sku: clean(b.sku), color: clean(b.color), stock: (b.stock === '' || b.stock == null) ? null : Math.max(0, Math.floor(+b.stock || 0)),
  img1: /^key\/[\w.-]+$/.test(b.img1 || '') ? b.img1 : '', size: Array.isArray(b.size) ? b.size.map(clean) : [], desc: clean(b.desc)
});
// Kiểm tra API key (so sánh an toàn) + chặn dò khóa: sai quá 20 lần / 15 phút thì khóa IP đó tạm thời
const fails = new Map(); setInterval(() => fails.clear(), 15 * 60e3).unref();
const auth = (q, s, n) => {
  const c = fails.get(q.ip) || 0; if (c >= 20) return s.status(429).json({ error: 'Thử quá nhiều lần. Hãy đợi 15 phút.' });
  const k = String(q.headers['x-api-key'] || '');
  if (k.length === KEY.length && crypto.timingSafeEqual(Buffer.from(k), Buffer.from(KEY))) return n();
  fails.set(q.ip, c + 1); s.status(401).json({ error: 'Unauthorized' });
};
 
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, 'public', 'key'),
    filename: (q, f, cb) => cb(null, Date.now() + path.extname(f.originalname).toLowerCase())
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (q, f, cb) => cb(null, /\.(jpe?g|png|webp)$/i.test(f.originalname))
});
 
// Công khai: landing page gọi, chỉ trả sản phẩm đang hiển thị, đúng định dạng { data: [...] }
app.get('/api/products', (q, s) => s.set('Cache-Control', 'no-store').json({ data: load().filter(p => !p.hidden) }));
// Quản trị: cần API key (web 1 gọi)
app.use('/api/admin', auth, express.json());
app.get('/api/admin/products', (q, s) => s.json(load()));
app.post('/api/admin/products', (q, s) => {
  const l = load(), now = new Date().toISOString(), p = pick(q.body);
  if (!p.name) return s.status(400).json({ error: 'Thiếu tên sản phẩm' });
  const item = { id: Math.max(0, ...l.map(x => x.id), ...trash().map(x => x.id)) + 1, ...p, createdAt: now, updatedAt: now };
  l.push(item); save(l); s.json(item);
});
app.put('/api/admin/products/:id', (q, s) => {
  const l = load(), i = l.findIndex(x => x.id == q.params.id);
  if (i < 0) return s.sendStatus(404);
  l[i] = { ...l[i], ...pick(q.body), updatedAt: new Date().toISOString() }; save(l); s.json(l[i]);
});
app.delete('/api/admin/products/:id', (q, s) => {          // chuyển vào thùng rác
  const l = load(), i = l.findIndex(x => x.id == q.params.id);
  if (i < 0) return s.sendStatus(404);
  const [it] = l.splice(i, 1); saveT([...trash(), { ...it, deletedAt: new Date().toISOString() }]); save(l); s.json({ ok: true });
});
app.get('/api/admin/trash', (q, s) => s.json(trash()));
app.post('/api/admin/trash/:id/restore', (q, s) => {
  const t = trash(), i = t.findIndex(x => x.id == q.params.id);
  if (i < 0) return s.sendStatus(404);
  const [it] = t.splice(i, 1); delete it.deletedAt; save([...load(), it]); saveT(t); s.json({ ok: true });
});
app.delete('/api/admin/trash/:id', (q, s) => { saveT(trash().filter(x => x.id != q.params.id)); s.json({ ok: true }); });
app.post('/api/admin/upload', upload.single('image'), (q, s) =>
  q.file ? s.json({ path: 'key/' + q.file.filename }) : s.status(400).json({ error: 'Chỉ nhận jpg, png, webp (tối đa 5MB)' }));
 
 
// ---------- Ngày giờ (theo giờ máy chủ) ----------
const dayStr = off => new Date(Date.now() + off * 864e5 - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
 
// ---------- Marketing & ưu đãi ----------
const PR = path.join(__dirname, 'promotions.json');
const loadPr = () => { try { return JSON.parse(fs.readFileSync(PR, 'utf8')); } catch { return []; } };
const savePr = l => writeFile(PR, JSON.stringify(l, null, 2));
const dateOk = d => /^\d{4}-\d{2}-\d{2}$/.test(d || '') ? d : '';
const pickPr = b => ({
  title: clean(b.title).slice(0, 120), badge: clean(b.badge).slice(0, 20), summary: clean(b.summary).slice(0, 300),
  content: clean(b.content).slice(0, 5000), startDate: dateOk(b.startDate), endDate: dateOk(b.endDate),
  published: !!b.published, img: /^key\/[\w.-]+$/.test(b.img || '') ? b.img : ''
});
const prErr = p => !p.title ? 'Thiếu tiêu đề bài viết' : (p.startDate && p.endDate && p.endDate < p.startDate) ? 'Ngày kết thúc phải sau ngày bắt đầu' : null;
const live = p => p.published && (!p.startDate || p.startDate <= dayStr(0)) && (!p.endDate || p.endDate >= dayStr(0));
 
// Công khai: trang chủ gọi, chỉ trả bài đã đăng và còn hạn
app.get('/api/promotions', (q, s) => s.set('Cache-Control', 'no-store').json({
  data: loadPr().filter(live).sort((a, b) => b.id - a.id).map(({ id, title, badge, summary, content, startDate, endDate, img }) => ({ id, title, badge, summary, content, startDate, endDate, img }))
}));
 
// ---------- Đếm lượt truy cập (ẩn danh: chỉ lưu số đếm và mã băm ngắn) ----------
const VF = path.join(__dirname, 'visits.json');
let V; try { V = JSON.parse(fs.readFileSync(VF, 'utf8')); } catch { V = { days: {} }; }
let dirty = false;
const flush = () => {
  if (!dirty) return;
  const keep = [dayStr(0), dayStr(-1)], cut = dayStr(-400);
  for (const [d, o] of Object.entries(V.days)) { if (d < cut) delete V.days[d]; else if (!keep.includes(d)) delete o.u; }
  writeFile(VF, JSON.stringify(V)); dirty = false;
};
setInterval(flush, 10000).unref();
for (const sg of ['SIGINT', 'SIGTERM']) process.on(sg, () => { flush(); process.exit(); });
const vhits = new Map(); setInterval(() => vhits.clear(), 3600e3).unref();
app.post('/api/visit', express.json({ limit: '1kb' }), (q, s) => {
  const a = (vhits.get(q.ip) || []); a.push(Date.now()); vhits.set(q.ip, a);
  const vid = String((q.body && q.body.vid) || '');
  if (a.length > 30 || !/^[\w-]{8,64}$/.test(vid) || /bot|crawl|spider|slurp|preview/i.test(q.headers['user-agent'] || '')) return s.sendStatus(204);
  const d = V.days[dayStr(0)] || (V.days[dayStr(0)] = { v: 0, n: 0, u: [] }), h = crypto.createHash('sha256').update(vid).digest('hex').slice(0, 10);
  if (!d.u) d.u = [];
  d.v++; if (!d.u.includes(h)) { d.u.push(h); d.n++; }
  dirty = true; s.sendStatus(204);
});
 
// ---------- Quản trị: thống kê + bài ưu đãi (cần API key) ----------
app.get('/api/admin/stats', (q, s) => {
  const series = []; for (let i = 13; i >= 0; i--) { const k = dayStr(-i), o = V.days[k] || {}; series.push({ d: k, v: o.v || 0, n: o.n || 0 }); }
  const sum = n => series.slice(-n).reduce((a, x) => a + x.v, 0), from = dayStr(-29);
  s.json({ today: series[13].v, uniqToday: series[13].n, week: sum(7),
    month: Object.entries(V.days).filter(([k]) => k >= from).reduce((a, [, o]) => a + (o.v || 0), 0),
    total: Object.values(V.days).reduce((a, o) => a + (o.v || 0), 0), series });
});
app.get('/api/admin/promotions', (q, s) => s.json(loadPr()));
app.post('/api/admin/promotions', (q, s) => {
  const l = loadPr(), p = pickPr(q.body), e = prErr(p); if (e) return s.status(400).json({ error: e });
  const now = new Date().toISOString(), it = { id: Math.max(0, ...l.map(x => x.id)) + 1, ...p, createdAt: now, updatedAt: now };
  l.push(it); savePr(l); s.json(it);
});
app.put('/api/admin/promotions/:id', (q, s) => {
  const l = loadPr(), i = l.findIndex(x => x.id == q.params.id); if (i < 0) return s.sendStatus(404);
  const p = pickPr(q.body), e = prErr(p); if (e) return s.status(400).json({ error: e });
  l[i] = { ...l[i], ...p, updatedAt: new Date().toISOString() }; savePr(l); s.json(l[i]);
});
app.delete('/api/admin/promotions/:id', (q, s) => { savePr(loadPr().filter(x => x.id != q.params.id)); s.json({ ok: true }); });
 
app.use(express.static(path.join(__dirname, 'public')));   // landing page + products.js + ảnh
app.listen(process.env.PORT || 3001);
 