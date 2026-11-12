<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Đăng nhập / Đăng ký</title>
<style>
:root{--bg:#f4f5f9;--card:#fff;--text:#1c1e26;--muted:#6b7080;--line:#dfe2ea;--accent:#4f46e5;--accent-t:#fff;--err:#c62828;--ok:#2e7d32;
box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#14151b;--card:#1e2029;--text:#eceef5;--muted:#9aa0b4;--line:#33364a;--accent:#7c78ff;--accent-t:#10101a;--err:#ff8a80;--ok:#81c784;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#14151b;--card:#1e2029;--text:#eceef5;--muted:#9aa0b4;--line:#33364a;--accent:#7c78ff;--accent-t:#10101a;--err:#ff8a80;--ok:#81c784;color-scheme:dark}
*{box-sizing:border-box}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.card{width:100%;max-width:400px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:28px}
h1{font-size:22px;margin:0 0 4px}
p.sub{margin:0 0 20px;color:var(--muted);font-size:14px}
.tabs{display:flex;gap:4px;background:var(--bg);padding:4px;border-radius:10px;margin-bottom:18px}
.tabs button{flex:1;border:0;background:none;color:var(--muted);padding:9px;border-radius:8px;font-size:14px;cursor:pointer}
.tabs button.on{background:var(--card);color:var(--text);font-weight:600}
label{display:block;font-size:13px;color:var(--muted);margin:12px 0 5px}
input,select,textarea{width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--text);font-size:15px}
input:focus,select:focus,textarea:focus{outline:2px solid var(--accent);border-color:transparent}
.btn{width:100%;margin-top:18px;padding:12px;border:0;border-radius:10px;background:var(--accent);color:var(--accent-t);font-size:15px;font-weight:600;cursor:pointer}
.btn.ghost{background:none;border:1px solid var(--line);color:var(--text);margin-top:10px}
.msg{min-height:20px;margin-top:12px;font-size:13px}
.msg.err{color:var(--err)}.msg.ok{color:var(--ok)}
.hint{font-size:12px;color:var(--muted);margin-top:5px}
.badge{display:inline-block;padding:2px 10px;border-radius:99px;font-size:12px;font-weight:600;background:var(--accent);color:var(--accent-t)}
.list{margin-top:14px;border:1px solid var(--line);border-radius:10px;max-height:240px;overflow-y:auto}
.row{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--line);font-size:14px;gap:8px}
.row:last-child{border-bottom:0}
.row button{border:0;background:none;color:var(--err);cursor:pointer;font-size:13px}
.card.wide{max-width:640px}
.pform{display:grid;gap:8px;margin-top:10px}
.pform .btn{margin-top:4px}
.pprice{font-weight:600;white-space:nowrap}
.pd{color:var(--muted);font-size:12px;margin-top:2px}
.acts{display:flex;gap:12px}
.row button.edit{color:var(--accent)}
.hide{display:none}
textarea{font-family:inherit;resize:vertical}
.th{width:44px;height:44px;object-fit:cover;border-radius:8px;flex:none;background:var(--bg)}
.tag{display:inline-block;padding:1px 8px;border-radius:99px;font-size:11px;font-weight:600;background:var(--accent);color:var(--accent-t);vertical-align:middle}
.prev{width:100%;max-height:200px;object-fit:contain;border:1px solid var(--line);border-radius:10px;background:var(--bg)}
.chk{display:flex;align-items:center;gap:8px;font-size:14px;margin:0}
.chk input{width:auto}
.pform .lb{margin:6px 0 0}
.syncbox{border:1px dashed var(--accent);border-radius:10px;padding:10px 12px;font-size:13px}
</style>
</head>
<body>
<div class="card" id="card">
  <!-- Màn hình đăng nhập / đăng ký -->
  <div id="authView">
    <h1>Chào mừng</h1>
    <p class="sub">Đăng nhập hoặc tạo tài khoản mới</p>
    <div class="tabs">
      <button id="tabLogin" class="on" type="button">Đăng nhập</button>
      <button id="tabReg" type="button">Đăng ký</button>
    </div>

    <div id="loginForm">
      <label for="lRole">Đăng nhập với tư cách</label>
      <select id="lRole"><option value="user">Người dùng (User)</option><option value="admin">Quản trị (Admin)</option></select>
      <label for="lUser">Tên đăng nhập</label>
      <input id="lUser" autocomplete="username">
      <label for="lPass">Mật khẩu</label>
      <input id="lPass" type="password" autocomplete="current-password">
      <button class="btn" id="btnLogin" type="button">Đăng nhập</button>
    </div>

    <div id="regForm" class="hide">
      <label for="rRole">Loại tài khoản</label>
      <select id="rRole"><option value="user">Người dùng (User)</option><option value="admin" id="optAdmin">Quản trị (Admin)</option></select>
      <div class="hint" id="adminHint"></div>
      <label for="rUser">Tên đăng nhập</label>
      <input id="rUser" autocomplete="username">
      <label for="rPass">Mật khẩu (tối thiểu 6 ký tự)</label>
      <input id="rPass" type="password" autocomplete="new-password">
      <label for="rPass2">Nhập lại mật khẩu</label>
      <input id="rPass2" type="password" autocomplete="new-password">
      <button class="btn" id="btnReg" type="button">Tạo tài khoản</button>
    </div>
    <div class="msg" id="msg"></div>
  </div>

  <!-- Màn hình sau khi đăng nhập -->
  <div id="homeView" class="hide">
    <h1>Xin chào, <span id="hName"></span></h1>
    <p class="sub">Vai trò: <span class="badge" id="hRole"></span></p>
    <div id="adminPanel" class="hide">
      <strong style="font-size:14px">Danh sách người dùng</strong>
      <div class="list" id="userList"></div>
    </div>
    <div style="margin-top:20px">
      <strong style="font-size:14px">Sản phẩm</strong>
      <div id="pForm" class="pform hide">
        <input id="pName" placeholder="Tên sản phẩm">
        <input id="pPrice" type="number" min="0" placeholder="Giá (VNĐ)">
        <input id="pSale" type="number" min="0" placeholder="Giá khuyến mãi (không bắt buộc)">
        <label class="lb" for="pBrand">Nhóm sản phẩm</label>
        <select id="pBrand"></select>
        <input id="pBrandNew" class="hide" placeholder="Nhập tên nhóm mới">
        <label class="lb" for="pRating">Đánh giá (sao)</label>
        <select id="pRating"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select>
        <label class="chk"><input id="pTop" type="checkbox"> Sản phẩm bán chạy (Top seller)</label>
        <textarea id="pSize" rows="3" placeholder="Kích thước, mỗi dòng một loại&#10;VD: 1700x800x570(mm)"></textarea>
        <input id="pDesc" placeholder="Mô tả ngắn">
        <label class="lb" for="pImg">Hình ảnh sản phẩm (chọn từ máy tính hoặc điện thoại)</label>
        <input id="pImg" type="file" accept="image/*">
        <img id="pPrev" class="prev hide" alt="Xem trước ảnh">
        <button class="btn" id="btnSave" type="button">Thêm sản phẩm</button>
        <button class="btn ghost hide" id="btnCancel" type="button">Hủy sửa</button>
        <div class="msg" id="pMsg"></div>
        <div class="syncbox hide" id="syncBox">
          <div id="syncInfo"></div>
          <button class="btn" id="btnSync" type="button">Ghi vào products.js</button>
        </div>
      </div>
      <input id="pSearch" placeholder="Tìm sản phẩm theo tên..." style="margin-top:12px">
      <div class="list" id="prodList"></div>
    </div>
    <button class="btn ghost" id="btnOut" type="button">Đăng xuất</button>
  </div>
</div>

<script src="./products.js"></script>
<script>
const $ = id => document.getElementById(id);
const KEY_ACC = 'app_accounts';
const KEY_SES = 'app_session';

let mem = {};
function read(k, def){
  // session ưu tiên đọc từ sessionStorage, các key khác từ localStorage
  try{
    const store = (k === KEY_SES) ? sessionStorage : localStorage;
    const v = store.getItem(k);
    return v ? JSON.parse(v) : def;
  }catch(e){ return k in mem ? mem[k] : def; }
}
function write(k, v){
  mem[k] = v;
  try{
    const store = (k === KEY_SES) ? sessionStorage : localStorage;
    store.setItem(k, JSON.stringify(v));
  }catch(e){}
}
const getAccounts = () => read(KEY_ACC, []);
const hasAdmin = () => getAccounts().some(a => a.role === 'admin');

/* ---------- Băm mật khẩu (SHA-256 + salt) ---------- */
async function hashPw(pw, salt){
  const data = new TextEncoder().encode(salt + pw);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
}
const newSalt = () => [...crypto.getRandomValues(new Uint8Array(12))].map(b => b.toString(16).padStart(2,'0')).join('');

/* ---------- Giao diện ---------- */
function say(text, type){ const m = $('msg'); m.textContent = text; m.className = 'msg ' + (type || ''); }
function switchTab(login){
  $('loginForm').classList.toggle('hide', !login);
  $('regForm').classList.toggle('hide', login);
  $('tabLogin').classList.toggle('on', login);
  $('tabReg').classList.toggle('on', !login);
  say('');
  refreshAdminOption();
}
function refreshAdminOption(){
  const taken = hasAdmin();
  $('optAdmin').disabled = taken;
  $('adminHint').textContent = taken ? 'Hệ thống đã có Admin, không thể tạo thêm.' : 'Chưa có Admin: bạn có thể tạo tài khoản Admin duy nhất.';
  if (taken && $('rRole').value === 'admin') $('rRole').value = 'user';
}

/* ---------- Đăng ký ---------- */
async function register(){
  const role = $('rRole').value, name = $('rUser').value.trim();
  const p1 = $('rPass').value, p2 = $('rPass2').value;
  if (name.length < 3 || /\s/.test(name)) return say('Tên đăng nhập tối thiểu 3 ký tự, không có khoảng trắng.', 'err');
  if (p1.length < 6) return say('Mật khẩu tối thiểu 6 ký tự.', 'err');
  if (p1 !== p2) return say('Mật khẩu nhập lại không khớp.', 'err');
  const accs = getAccounts();
  if (accs.some(a => a.username.toLowerCase() === name.toLowerCase())) return say('Tên đăng nhập đã tồn tại.', 'err');
  if (role === 'admin' && accs.some(a => a.role === 'admin')) return say('Hệ thống chỉ cho phép 1 Admin.', 'err');
  const salt = newSalt();
  accs.push({ username: name, salt, hash: await hashPw(p1, salt), role, createdAt: Date.now() });
  write(KEY_ACC, accs);
  ['rUser','rPass','rPass2'].forEach(i => $(i).value = '');
  switchTab(true);
  $('lUser').value = name;
  say('Tạo tài khoản thành công! Hãy đăng nhập.', 'ok');
}

/* ---------- Đăng nhập ---------- */
async function login(){
  const role = $('lRole').value, name = $('lUser').value.trim(), pw = $('lPass').value;
  if (!name || !pw) return say('Vui lòng nhập đầy đủ thông tin.', 'err');
  const acc = getAccounts().find(a => a.username.toLowerCase() === name.toLowerCase());
  if (!acc || await hashPw(pw, acc.salt) !== acc.hash) return say('Sai tên đăng nhập hoặc mật khẩu.', 'err');
  if (acc.role !== role) return say(role === 'admin' ? 'Tài khoản này không phải Admin.' : 'Đây là tài khoản Admin, hãy chọn đăng nhập Admin.', 'err');
  write(KEY_SES, { username: acc.username, role: acc.role });
  $('lPass').value = '';

  // ===== THÊM ĐOẠN NÀY: quay lại trang trước nếu có ?redirect= =====
  const redirect = new URLSearchParams(location.search).get('redirect');
  if (redirect) { location.replace(redirect); return; }
  // ================================================================
  showHome();
}

/* ---------- Trang sau đăng nhập ---------- */
function showHome(){
  const s = read(KEY_SES, null);
  const acc = s && getAccounts().find(a => a.username === s.username);
  if (!acc){ return showAuth(); }
  $('authView').classList.add('hide');
  $('homeView').classList.remove('hide');
  $('hName').textContent = acc.username;
  $('hRole').textContent = acc.role === 'admin' ? 'Admin' : 'User';
  $('adminPanel').classList.toggle('hide', acc.role !== 'admin');
  if (acc.role === 'admin') renderUsers();
  $('pForm').classList.toggle('hide', acc.role !== 'admin');
  $('card').classList.add('wide');
  resetForm(); renderProducts();
}
function renderUsers(){
  const box = $('userList'); box.innerHTML = '';
  const users = getAccounts().filter(a => a.role === 'user');
  if (!users.length){ box.innerHTML = '<div class="row" style="color:var(--muted)">Chưa có người dùng nào.</div>'; return; }
  users.forEach(u => {
    const row = document.createElement('div'); row.className = 'row';
    const span = document.createElement('span'); span.textContent = u.username;
    const del = document.createElement('button'); del.textContent = 'Xóa';
    del.onclick = () => {
      if (!confirm('Xóa tài khoản "' + u.username + '"?')) return;
      write(KEY_ACC, getAccounts().filter(a => a.username !== u.username));
      renderUsers();
    };
    row.append(span, del); box.appendChild(row);
  });
}
function showAuth(){
  write(KEY_SES, null);
  // xoá luôn khỏi sessionStorage phòng trường hợp v có giá trị cũ
  try{ sessionStorage.removeItem(KEY_SES); }catch(e){}
  $('homeView').classList.add('hide');
  $('card').classList.remove('wide');
  $('authView').classList.remove('hide');
  switchTab(true);
}

/* ---------- Sản phẩm: Admin thêm mới -> ghi vào products.js ---------- */
const KEY_PEND = 'app_pending_products';
let editRef = null, imgData = null; // editRef: {kind:"pending"|"exist", id}
const base = () => Array.isArray(window.products) ? window.products : [];
// Danh sách chờ ghi; tự loại những SP đã có trong products.js (cùng đường dẫn ảnh)
function getPending(){
  const have = new Set(base().map(p => p.img1));
  return read(KEY_PEND, []).filter(p => !have.has(p.img1));
}
function setPending(l){
  mem[KEY_PEND] = l;
  try{ localStorage.setItem(KEY_PEND, JSON.stringify(l)); return true; }catch(e){ return false; }
}
const KEY_ED = 'app_pending_edits', KEY_DEL = 'app_pending_del';
function setStore(k, v){ mem[k] = v; try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }
const norm = p => JSON.stringify(Object.keys(p).filter(k => k[0] !== '_').sort().map(k => [k, p[k]]));
// Bản sửa chờ ghi (tự bỏ khi products.js đã chứa đúng nội dung đó)
function getEdits(){
  const e = read(KEY_ED, {}), out = {};
  Object.keys(e).forEach(id => { const b = base().find(p => String(p.id) === id); if (b && norm(e[id]) !== norm(b)) out[id] = e[id]; });
  return out;
}
// Danh sách id chờ xóa (tự bỏ khi SP đã không còn trong products.js)
function getDels(){
  const ids = new Set(base().map(p => String(p.id)));
  return read(KEY_DEL, []).map(String).filter(id => ids.has(id));
}
const nextId = () => Math.max(0, ...base().map(p => +p.id || 0), ...getPending().map(p => +p.id || 0)) + 1;
function curAdmin(){
  const s = read(KEY_SES, null);
  const a = s && getAccounts().find(x => x.username === s.username);
  return !!a && a.role === 'admin';
}
const fmtPrice = n => Number(n).toLocaleString('vi-VN') + ' đ';
const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40) || 'sp';
function pSay(t, type){ const m = $('pMsg'); m.textContent = t; m.className = 'msg ' + (type || ''); }

/* Ảnh: chọn từ máy tính / thư viện ảnh / camera điện thoại, nén về JPEG tối đa 1000px */
function loadImg(file){
  return new Promise((res, rej) => {
    const u = URL.createObjectURL(file), im = new Image();
    im.onload = () => { URL.revokeObjectURL(u); res(im); };
    im.onerror = rej; im.src = u;
  });
}
async function compress(file){
  const im = await loadImg(file), k = Math.min(1, 1000 / Math.max(im.width, im.height));
  const c = document.createElement('canvas');
  c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
  x.drawImage(im, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.82);
}
$('pImg').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try{ imgData = await compress(f); $('pPrev').src = imgData; $('pPrev').classList.remove('hide'); pSay(''); }
  catch(_){ imgData = null; pSay('Không đọc được ảnh này, hãy chọn ảnh khác.', 'err'); }
};

/* Nhóm sản phẩm (brand) lấy từ products.js */
function fillBrands(sel){
  const set = [...new Set([...base().map(p => (p.brand || '').trim()), ...getPending().map(p => p.brand)].filter(Boolean))];
  const s = $('pBrand'); s.innerHTML = '';
  [...set, '__new'].forEach(b => { const o = document.createElement('option'); o.value = b; o.textContent = b === '__new' ? '+ Nhóm khác…' : b; s.appendChild(o); });
  if (sel && set.includes(sel)) s.value = sel;
  $('pBrandNew').classList.toggle('hide', s.value !== '__new');
}
$('pBrand').onchange = () => $('pBrandNew').classList.toggle('hide', $('pBrand').value !== '__new');

function resetForm(){
  editRef = null; imgData = null;
  ['pName','pPrice','pSale','pSize','pDesc','pBrandNew'].forEach(i => $(i).value = '');
  $('pImg').value = ''; $('pPrev').classList.add('hide'); $('pPrev').removeAttribute('src');
  $('pRating').value = '5'; $('pTop').checked = false;
  fillBrands();
  $('btnSave').textContent = 'Thêm sản phẩm';
  $('btnCancel').classList.add('hide');
  pSay('');
}
function saveProduct(){
  if (!curAdmin()) return pSay('Chỉ Admin mới có quyền này.', 'err');
  const name = $('pName').value.trim(), desc = $('pDesc').value.trim(), price = Number($('pPrice').value);
  const sale = $('pSale').value === '' ? null : Number($('pSale').value);
  const brand = $('pBrand').value === '__new' ? $('pBrandNew').value.trim() : $('pBrand').value;
  const size = $('pSize').value.split('\n').map(s => s.trim()).filter(Boolean);
  if (!name) return pSay('Vui lòng nhập tên sản phẩm.', 'err');
  if ($('pPrice').value === '' || isNaN(price) || price < 0) return pSay('Giá không hợp lệ.', 'err');
  if (sale !== null && (isNaN(sale) || sale < 0 || sale >= price)) return pSay('Giá khuyến mãi phải nhỏ hơn giá gốc.', 'err');
  if (!brand) return pSay('Vui lòng chọn hoặc nhập nhóm sản phẩm.', 'err');
  if (!editRef && !imgData) return pSay('Vui lòng chọn ảnh sản phẩm.', 'err');

  // Cùng cấu trúc & thứ tự trường với products.js; giữ lại các trường lạ của SP cũ (nếu có)
  const build = (id, img1, extra) => {
    const p = { id, name, price };
    if (sale !== null) p.salePrice = sale;
    p.brand = brand; p.rating = Number($('pRating').value);
    if ($('pTop').checked) p.isTopseller = true;
    p.img1 = img1; p.size = size.length ? size : [' ']; p.desc = desc;
    Object.keys(extra || {}).forEach(k => { if (!(k in p) && k !== 'salePrice' && k !== 'isTopseller' && k[0] !== '_') p[k] = extra[k]; });
    return p;
  };
  const newPath = () => 'key/' + slug(name) + '-' + Date.now().toString(36) + '.jpg';
  let ok = true, wasEdit = !!editRef;
  if (editRef && editRef.kind === 'exist'){
    const old = base().find(p => String(p.id) === String(editRef.id)), eds = getEdits(), cur = eds[old.id] || old;
    const p = build(old.id, imgData ? (cur._img ? cur.img1 : newPath()) : cur.img1, old);
    if (imgData) p._img = imgData; else if (cur._img) p._img = cur._img;
    eds[old.id] = p; ok = setStore(KEY_ED, eds);
  } else {
    let list = getPending();
    const old = editRef && list.find(p => p.id === editRef.id);
    const p = build(old ? old.id : nextId(), old ? old.img1 : newPath(), old);
    p._img = imgData || (old && old._img);
    ok = setPending(old ? list.map(x => x.id === old.id ? p : x) : [...list, p]);
  }
  if (!ok) return pSay('Bộ nhớ trình duyệt đã đầy. Hãy bấm "Ghi vào products.js" cho các thay đổi đang chờ rồi làm tiếp.', 'err');
  resetForm(); renderProducts();
  pSay(wasEdit ? 'Đã lưu chỉnh sửa (chờ ghi).' : 'Đã thêm sản phẩm. Bấm "Ghi vào products.js" để lưu chính thức.', 'ok');
}

/* ---------- Danh sách ---------- */
function startEdit(p, kind){
  resetForm(); editRef = { kind, id: p.id };
  $('pName').value = p.name; $('pPrice').value = p.price; $('pSale').value = p.salePrice || '';
  const b = (p.brand || '').trim(); fillBrands(b);
  if ($('pBrand').value !== b){ $('pBrand').value = '__new'; $('pBrandNew').value = b; $('pBrandNew').classList.remove('hide'); }
  $('pRating').value = String(p.rating || 5); $('pTop').checked = !!p.isTopseller;
  $('pSize').value = (p.size || []).filter(s => s.trim()).join('\n'); $('pDesc').value = p.desc || '';
  $('pPrev').src = p._img || p.img1; $('pPrev').classList.remove('hide');
  $('btnSave').textContent = 'Lưu thay đổi'; $('btnCancel').classList.remove('hide');
  pSay('Đang sửa: ' + p.name + (kind === 'exist' ? ' (không chọn ảnh mới thì giữ ảnh cũ)' : '')); $('pName').focus();
  $('pForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function mkBtn(text, cls, fn){ const b = document.createElement('button'); b.textContent = text; if (cls) b.className = cls; b.onclick = fn; return b; }
// kind: 'pending' (mới thêm) | 'exist' (đã có trong products.js); st: {edited, deleted}
function mkRow(p, kind, admin, st){
  st = st || {};
  const row = document.createElement('div'); row.className = 'row';
  const im = document.createElement('img'); im.className = 'th'; im.alt = ''; im.loading = 'lazy';
  im.src = p._img || p.img1; im.onerror = () => im.style.visibility = 'hidden';
  const info = document.createElement('div'); info.style.flex = '1';
  const n = document.createElement('div'); n.textContent = p.name; n.style.fontWeight = '600';
  const label = st.deleted ? 'Chờ xóa' : kind === 'pending' ? 'Chờ ghi' : st.edited ? 'Đã sửa, chờ ghi' : '';
  if (label){ const t = document.createElement('span'); t.className = 'tag'; t.textContent = label; n.append(' ', t); }
  if (st.deleted) row.style.opacity = '.5', n.style.textDecoration = 'line-through';
  info.appendChild(n);
  const d = document.createElement('div'); d.className = 'pd'; d.textContent = [(p.brand || '').trim(), p.desc].filter(Boolean).join(' · '); info.appendChild(d);
  const price = document.createElement('span'); price.className = 'pprice'; price.textContent = fmtPrice(p.salePrice || p.price);
  row.append(im, info, price);
  if (admin){
    const acts = document.createElement('div'); acts.className = 'acts';
    if (st.deleted){
      acts.append(mkBtn('Hoàn tác', 'edit', () => { setStore(KEY_DEL, getDels().filter(x => x !== String(p.id))); renderProducts(); }));
    } else {
      acts.append(mkBtn('Sửa', 'edit', () => startEdit(p, kind)));
      acts.append(mkBtn('Xóa', '', () => {
        if (!curAdmin() || !confirm('Xóa sản phẩm "' + p.name + '"?' + (kind === 'exist' ? '\n(Sẽ được xóa khỏi products.js khi bạn bấm "Ghi vào products.js")' : ''))) return;
        if (kind === 'pending') setPending(getPending().filter(x => x.id !== p.id));
        else { const e = getEdits(); delete e[p.id]; setStore(KEY_ED, e); setStore(KEY_DEL, [...getDels(), String(p.id)]); }
        if (editRef && editRef.kind === kind && editRef.id === p.id) resetForm();
        renderProducts();
      }));
    }
    row.appendChild(acts);
  }
  return row;
}
function renderProducts(){
  const box = $('prodList'); box.innerHTML = '';
  const admin = curAdmin(), pend = admin ? getPending() : [];
  const eds = admin ? getEdits() : {}, dels = new Set(admin ? getDels() : []);
  const q = $('pSearch').value.trim().toLowerCase();
  const hit = p => !q || p.name.toLowerCase().includes(q);
  const cnt = [pend.length && pend.length + ' thêm mới', Object.keys(eds).length && Object.keys(eds).length + ' đã sửa', dels.size && dels.size + ' chờ xóa'].filter(Boolean);
  $('syncBox').classList.toggle('hide', !cnt.length);
  $('syncInfo').textContent = 'Chờ ghi vào products.js: ' + cnt.join(', ');
  pend.filter(hit).forEach(p => box.appendChild(mkRow(p, 'pending', admin)));
  const all = base().map(p => ({ p: eds[p.id] || p, st: { edited: !!eds[p.id], deleted: dels.has(String(p.id)) } })).filter(x => hit(x.p)), LIM = 30;
  all.slice(0, LIM).forEach(x => box.appendChild(mkRow(x.p, 'exist', admin, x.st)));
  if (all.length > LIM){ const m = document.createElement('div'); m.className = 'row'; m.style.color = 'var(--muted)'; m.textContent = 'Đang hiện ' + LIM + '/' + all.length + ' sản phẩm. Dùng ô tìm kiếm để lọc.'; box.appendChild(m); }
  if (!box.children.length) box.innerHTML = '<div class="row" style="color:var(--muted)">Không có sản phẩm nào.</div>';
}

/* ---------- Ghi vào products.js ---------- */
const q = v => JSON.stringify(v);
// Định dạng 1 sản phẩm giống các mục hiện có trong products.js
function ser(p){
  const L = Object.keys(p).filter(k => k[0] !== '_').map(k =>
    k === 'size' ? '        size:[' + p.size.map(q).join(',\n            ') + ',]' : '        ' + k + ': ' + q(p[k]));
  return '    {' + L[0].trim() + ',\n' + L.slice(1).join(',\n') + ',},\n';
}
// Chèn sản phẩm mới vào cuối mảng, gán id nối tiếp id lớn nhất trong file
function merge(src, items){
  let n = Math.max(0, ...[...src.matchAll(/\bid\s*:\s*(\d+)/g)].map(m => +m[1]));
  items.forEach(p => p.id = ++n);
  const end = src.lastIndexOf('];');
  if (end < 0) throw new Error('products.js sai định dạng');
  let head = src.slice(0, end).replace(/\s+$/, '');
  if (!/[,\[]$/.test(head)) head += ',';
  return head + '\n' + items.map(ser).join('') + src.slice(end);
}
async function getSource(){
  try{ const r = await fetch('products.js', { cache: 'no-store' }); if (r.ok) return await r.text(); }catch(e){}
  return 'window.products = [\n' + base().map(ser).join('') + '];\n';
}
const bytes = d => Uint8Array.from(atob(d.split(',')[1]), c => c.charCodeAt(0));
const crcT = (() => { const t = []; for (let n = 0; n < 256; n++){ let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = b => { let c = ~0; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8); return ~c >>> 0; };
function makeZip(files){ // lưu không nén
  const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
  for (const f of files){
    const nm = enc.encode(f.name), crc = crc32(f.data), n = f.data.length;
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
    lh.setUint32(14, crc, true); lh.setUint32(18, n, true); lh.setUint32(22, n, true); lh.setUint16(26, nm.length, true);
    parts.push(lh.buffer, nm, f.data);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true);
    ch.setUint32(16, crc, true); ch.setUint32(20, n, true); ch.setUint32(24, n, true); ch.setUint16(28, nm.length, true); ch.setUint32(42, off, true);
    cen.push(ch.buffer, nm); off += 30 + nm.length + n;
  }
  const csz = cen.reduce((a, b) => a + b.byteLength, 0), e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, csz, true); e.setUint32(16, off, true);
  return new Blob([...parts, ...cen, e.buffer], { type: 'application/zip' });
}
// Tìm khối {id: N, ...} trong products.js (bỏ qua dấu ngoặc nằm trong chuỗi)
function findBlock(src, id){
  const m = new RegExp('\\{\\s*id\\s*:\\s*' + id + '\\s*,').exec(src); if (!m) return null;
  let i = m.index, d = 0, str = null;
  for (; i < src.length; i++){
    const c = src[i];
    if (str){ if (c === '\\') i++; else if (c === str) str = null; continue; }
    if (c === '"' || c === "'" || c === '`'){ str = c; continue; }
    if (c === '{') d++;
    else if (c === '}' && --d === 0){ i++; break; }
  }
  if (src[i] === ',') i++;
  return [m.index, i];
}
function applyChanges(src, items, edits, dels){
  dels.forEach(id => {
    const r = findBlock(src, id); if (!r) return;
    let a = r[0], b = r[1];
    while (a > 0 && /[ \t]/.test(src[a - 1])) a--;
    if (src[b] === '\r') b++; if (src[b] === '\n') b++;
    src = src.slice(0, a) + src.slice(b);
  });
  edits.forEach(e => { const r = findBlock(src, e.id); if (r) src = src.slice(0, r[0]) + ser(e).trim() + src.slice(r[1]); });
  return items.length ? merge(src, items) : src;
}
async function syncProducts(){
  if (!curAdmin()) return pSay('Chỉ Admin mới có quyền này.', 'err');
  const items = getPending().map(p => ({ ...p })), edits = Object.values(getEdits()).map(p => ({ ...p })), dels = getDels();
  if (!items.length && !edits.length && !dels.length) return;
  const imgs = [...items, ...edits.filter(e => e._img)];
  const summary = items.length + ' thêm, ' + edits.length + ' sửa, ' + dels.length + ' xóa';
  // Cách 1 (Chrome/Edge máy tính): chọn thư mục website, ghi thẳng products.js và ảnh vào key/
  if (window.showDirectoryPicker){
    try{
      const dir = await window.showDirectoryPicker({ mode: 'readwrite' });
      const fh = await dir.getFileHandle('products.js');
      const out = applyChanges(await (await fh.getFile()).text(), items, edits, dels);
      const kd = await dir.getDirectoryHandle('key', { create: true });
      for (const p of imgs){
        const w = await (await kd.getFileHandle(p.img1.replace(/^key\//, ''), { create: true })).createWritable();
        await w.write(bytes(p._img)); await w.close();
      }
      const w = await fh.createWritable(); await w.write(out); await w.close();
      const gone = new Set(dels);
      const arr = base().filter(p => !gone.has(String(p.id))).map(p => { const e = edits.find(x => String(x.id) === String(p.id)); if (!e) return p; const c = { ...e }; delete c._img; return c; });
      items.forEach(p => { delete p._img; arr.push(p); });
      window.products = arr;
      setPending([]); setStore(KEY_ED, {}); setStore(KEY_DEL, []); renderProducts();
      return pSay('Đã ghi vào products.js (' + summary + ').', 'ok');
    }catch(e){
      if (e && e.name === 'AbortError') return;
      if (e && e.name === 'NotFoundError') return pSay('Thư mục đã chọn không có products.js. Hãy chọn đúng thư mục website.', 'err');
    }
  }
  // Cách 2 (điện thoại / trình duyệt khác): tải gói .zip, giải nén đè vào thư mục website
  try{
    const out = applyChanges(await getSource(), items, edits, dels), enc = new TextEncoder();
    const files = [{ name: 'products.js', data: enc.encode(out) }, ...imgs.map(p => ({ name: p.img1, data: bytes(p._img) }))];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(makeZip(files)); a.download = 'enice-update.zip'; a.click();
    pSay('Đã tải enice-update.zip (' + summary + '). Giải nén đè vào thư mục website (products.js + key/), rồi tải lại trang.', 'ok');
  }catch(e){ pSay('Không tạo được file: ' + e.message, 'err'); }
}
$('btnSave').onclick = saveProduct;
$('btnCancel').onclick = resetForm;
$('btnSync').onclick = syncProducts;
$('pSearch').oninput = renderProducts;

/* ---------- Sự kiện ---------- */
$('tabLogin').onclick = () => switchTab(true);
$('tabReg').onclick = () => switchTab(false);
$('btnReg').onclick = register;
$('btnLogin').onclick = login;
$('btnOut').onclick = showAuth;
['lUser','lPass'].forEach(i => $(i).addEventListener('keydown', e => e.key === 'Enter' && login()));
['rUser','rPass','rPass2'].forEach(i => $(i).addEventListener('keydown', e => e.key === 'Enter' && register()));

refreshAdminOption();
if (read(KEY_SES, null)) showHome();
</script>
</body>
</html>
