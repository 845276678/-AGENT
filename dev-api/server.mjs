import http from 'node:http';
import { parse } from 'node:url';

const port = 8000;

function json(res, obj, status = 200){
  const body = JSON.stringify({ success: true, data: obj });
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(body);
}

function notFound(res){ res.writeHead(404); res.end('Not found'); }

const store = {,\n  walletHistory: {}\n};

function recalc(){
  let t = 0; for (const it of store.cart.items) { const p = store.products.find(p => p.id === it.productId); if (p) t += p.price * it.quantity; it.product = p; }
  store.cart.total = t; store.cart.currency = 'CNY';
}

const server = http.createServer(async (req, res) => {
  const { pathname, query } = parse(req.url, true);
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' }); return res.end(); }

  // Auth
  if (pathname === '/v1/auth/login' && req.method === 'POST') {
    return json(res, { token: 'demo.jwt' });
  }

  // Agents
  if (pathname === '/v1/agents' && req.method === 'GET') return json(res, { items: store.agents });
  if (pathname?.startsWith('/v1/agents/') && req.method === 'GET') {
    const id = pathname.split('/').pop(); return json(res, { id });
  }

  // Ideas
  if (pathname === '/v1/ideas' && req.method === 'GET') return json(res, { items: store.ideas, page: 1, pageSize: 20 });
  if (pathname === '/v1/ideas' && req.method === 'POST') {
    const body = await readJson(req); const id = 'i' + (store.ideas.length + 1); store.ideas.push({ id, ...body }); return json(res, { id });
  }

  // Store
  if (pathname === '/v1/store/products' && req.method === 'GET') return json(res, { items: store.products, page: 1, pageSize: 20 });
  if (pathname === '/v1/store/cart' && req.method === 'GET') { recalc(); return json(res, store.cart); }
  if (pathname === '/v1/store/cart/add' && req.method === 'POST') {
    const body = await readJson(req); const id = 'c' + (store.cart.items.length + 1);
    const existing = store.cart.items.find(it => it.productId === body.productId); if (existing) existing.quantity += body.quantity || 1; else store.cart.items.push({ itemId: id, productId: body.productId, quantity: body.quantity || 1 });
    recalc(); return json(res, {});
  }
  if (pathname?.startsWith('/v1/store/cart/') && req.method === 'PUT') {
    const id = pathname.split('/').pop(); const body = await readJson(req); const it = store.cart.items.find(i => i.itemId === id); if (it) it.quantity = body.quantity || 1; recalc(); return json(res, {});
  }
  if (pathname?.startsWith('/v1/store/cart/') && req.method === 'DELETE') {
    const id = pathname.split('/').pop(); store.cart.items = store.cart.items.filter(i => i.itemId !== id); recalc(); return json(res, {});
  }
  if (pathname === '/v1/store/purchase' && req.method === 'POST') { store.cart.items = []; recalc(); return json(res, {}); }

  // Users & wallet
  const profileMatch = pathname?.match(/^\/v1\/users\/(.+?)\/profile$/);
  if (profileMatch && req.method === 'GET') { const userId = profileMatch[1]; const p = store.profiles[userId] || store.profiles.u_demo; return json(res, { profile: p }); }
  if (profileMatch && req.method === 'PUT') { const userId = profileMatch[1]; const body = await readJson(req); store.profiles[userId] = { ...(store.profiles[userId] || {}), ...body }; return json(res, {}); }
  const walletMatch = pathname?.match(/^\/v1\/users\/(.+?)\/wallet(\/deposit|\/withdraw)?$/);
  if (walletMatch && req.method === 'GET') { const userId = walletMatch[1]; const w = store.wallet[userId] || store.wallet.u_demo; return json(res, { wallet: w }); }
  if (walletMatch && req.method === 'POST') {
    const userId = walletMatch[1]; const action = walletMatch[2]; const body = await readJson(req);
    const w = store.wallet[userId] || (store.wallet[userId] = { balance: 0, currency: 'CNY' });
    const amt = Number(body.amount) || 0;
    if (action === '/deposit') w.balance += amt;
    if (action === '/withdraw') w.balance = Math.max(0, w.balance - amt);
    const list = store.walletHistory[userId] || (store.walletHistory[userId] = []);
    list.push({ id: 'h' + (list.length + 1), type: action === '/deposit' ? 'deposit' : 'withdraw', amount: amt, ts: Date.now() });
    return json(res, {});
  }

    const histMatch = pathname?.match(/^\\/v1\\/users\\/(.+?)\\/wallet\\/history$/);\n  if (histMatch && req.method === 'GET') { const userId = histMatch[1]; const items = (store.walletHistory[userId] || []).slice().reverse(); return json(res, { items }); }\n\n  return notFound(res);
});

function readJson(req){
  return new Promise(resolve => { let data = ''; req.on('data', d => data += d); req.on('end', () => { try { resolve(JSON.parse(data||'{}')); } catch { resolve({}); } }); });
}

server.listen(port, () => console.log(`[dev-api] listening on http://localhost:${port}`));