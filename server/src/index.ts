import express from 'express';
import cors from 'cors';
import * as fundService from './services/fund.js';
import * as stockService from './services/stock.js';
import * as coinService from './services/coin.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Fund APIs
app.get('/api/fund/:code', async (req, res) => {
  const { code } = req.params;
  const data = await fundService.getFund(code);
  if (data) {
    res.json(data);
  } else {
    res.status(502).json({ error: 'Failed to fetch fund data' });
  }
});

app.post('/api/funds', async (req, res) => {
  const { codes } = req.body;
  if (!Array.isArray(codes)) {
    return res.status(400).json({ error: 'codes must be an array' });
  }
  const data = await fundService.getFunds(codes);
  res.json(data);
});

// Stock APIs
app.get('/api/stock/:secid', async (req, res) => {
  const { secid } = req.params;
  const data = await stockService.getStock(secid);
  if (data) {
    res.json(data);
  } else {
    res.status(502).json({ error: 'Failed to fetch stock data' });
  }
});

app.post('/api/stocks', async (req, res) => {
  const { secids } = req.body;
  if (!Array.isArray(secids)) {
    return res.status(400).json({ error: 'secids must be an array' });
  }
  const data = await stockService.getStocks(secids);
  res.json(data.filter(Boolean));
});

// Index (zindex) APIs (same as stock)
app.get('/api/zindex/:secid', async (req, res) => {
  const { secid } = req.params;
  const data = await stockService.getZindex(secid);
  if (data) {
    res.json(data);
  } else {
    res.status(502).json({ error: 'Failed to fetch index data' });
  }
});

app.post('/api/zindexs', async (req, res) => {
  const { secids } = req.body;
  if (!Array.isArray(secids)) {
    return res.status(400).json({ error: 'secids must be an array' });
  }
  const data = await stockService.getZindexs(secids);
  res.json(data.filter(Boolean));
});

// Coin APIs
app.get('/api/coins/:ids', async (req, res) => {
  const { ids } = req.params;
  const data = await coinService.getCoins(ids);
  if (data) {
    res.json(data);
  } else {
    res.status(502).json({ error: 'Failed to fetch coin data' });
  }
});

app.get('/api/coin/detail/:id', async (req, res) => {
  const { id } = req.params;
  const data = await coinService.getCoinDetail(id);
  if (data) {
    res.json(data);
  } else {
    res.status(502).json({ error: 'Failed to fetch coin detail' });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Fishing Funds API server running on http://localhost:${PORT}`);
});
