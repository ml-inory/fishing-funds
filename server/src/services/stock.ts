import { request, ProxyAgent } from 'undici';

const STOCK_API = 'https://push2.eastmoney.com/api/qt/stock/get';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

export interface StockResponse {
  f43: number; f44: number; f45: number; f46: number; f47: number; f48: number;
  f50: number; f57: string; f58: string; f60: number; f116: number; f117: number;
  f162: number; f167: number; f169: number; f170: number; f171: number;
}

interface EastmoneyStockResponse {
  data?: StockResponse;
}

function getDispatcher() {
  const proxyUrl = process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY;
  if (proxyUrl) {
    try { return new ProxyAgent(proxyUrl); } catch {}
  }
  return undefined;
}

async function fetchJson(url: string): Promise<any> {
  const dispatcher = getDispatcher();
  const res = await request(url, {
    headers: {
      'User-Agent': UA,
      Referer: 'https://quote.eastmoney.com/',
    },
    dispatcher,
    headersTimeout: 15000,
    bodyTimeout: 15000,
  });
  return res.body.json();
}

export async function getStock(secid: string): Promise<StockResponse | null> {
  try {
    const fields = 'f43,f44,f45,f46,f47,f48,f50,f57,f58,f60,f116,f117,f162,f167,f169,f170,f171';
    const json: EastmoneyStockResponse = await fetchJson(`${STOCK_API}?secid=${secid}&fields=${fields}`);
    return json.data || null;
  } catch {
    return null;
  }
}

export async function getStocks(secids: string[]): Promise<(StockResponse | null)[]> {
  return Promise.all(secids.map(getStock));
}

export const getZindex = getStock;
export const getZindexs = getStocks;

// Search stocks from Eastmoney
export async function searchStocks(keyword: string): Promise<any[]> {
  try {
    const url = `https://searchapi.eastmoney.com/api/suggest/get?input=${encodeURIComponent(keyword)}&type=14&token=D43BF722C8E33BDC906FB84D85E326E8&count=20`;
    const json = await fetchJson(url);
    return json?.QuotationCodeTable?.Data || [];
  } catch {
    return [];
  }
}
