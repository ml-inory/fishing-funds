import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fundService from './services/fund.js';
import * as stockService from './services/stock.js';
import * as coinService from './services/coin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Fund APIs
app.get('/api/fund/:code', async (req, res) => {
  const data = await fundService.getFund(req.params.code);
  data ? res.json(data) : res.status(502).json({ error: 'Failed to fetch fund data' });
});
app.post('/api/funds', async (req, res) => {
  if (!Array.isArray(req.body.codes)) return res.status(400).json({ error: 'codes must be an array' });
  res.json(await fundService.getFunds(req.body.codes));
});

// Fund search - fetch remote fund list from Eastmoney
app.get('/api/funds/search', async (_req, res) => {
  const data = await fundService.getFundList();
  data ? res.json(data) : res.status(502).json({ error: 'Failed to fetch fund list' });
});

// Stock APIs
app.get('/api/stock/:secid', async (req, res) => {
  const data = await stockService.getStock(req.params.secid);
  data ? res.json(data) : res.status(502).json({ error: 'Failed to fetch stock data' });
});
app.post('/api/stocks', async (req, res) => {
  if (!Array.isArray(req.body.secids)) return res.status(400).json({ error: 'secids must be an array' });
  res.json((await stockService.getStocks(req.body.secids)).filter(Boolean));
});

// Zindex APIs
app.get('/api/zindex/:secid', async (req, res) => {
  const data = await stockService.getZindex(req.params.secid);
  data ? res.json(data) : res.status(502).json({ error: 'Failed to fetch index data' });
});
app.post('/api/zindexs', async (req, res) => {
  if (!Array.isArray(req.body.secids)) return res.status(400).json({ error: 'secids must be an array' });
  res.json((await stockService.getZindexs(req.body.secids)).filter(Boolean));
});

// Coin APIs
app.get('/api/coins/:ids', async (req, res) => {
  const data = await coinService.getCoins(req.params.ids);
  data ? res.json(data) : res.status(502).json({ error: 'Failed to fetch coin data' });
});
app.get('/api/coin/detail/:id', async (req, res) => {
  const data = await coinService.getCoinDetail(req.params.id);
  data ? res.json(data) : res.status(502).json({ error: 'Failed to fetch coin detail' });
});

// Coin list - top coins from Coingecko
app.get('/api/coins/list/top', async (_req, res) => {
  const data = await coinService.getTopCoins();
  data ? res.json(data) : res.status(502).json({ error: 'Failed to fetch coin list' });
});

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

// Serve static frontend in production
const staticDir = path.resolve(__dirname, '../../web/dist');
app.use(express.static(staticDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Fishing Funds Web on http://localhost:${PORT}`);
});
