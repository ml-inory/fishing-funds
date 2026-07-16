const STOCK_API = 'https://push2.eastmoney.com/api/qt/stock/get';

export interface StockResponse {
  f43: number;  // 最新价
  f44: number;  // 最高价
  f45: number;  // 最低价
  f46: number;  // 开盘价
  f47: number;  // 成交量
  f48: number;  // 成交额
  f50: number;  // 量比
  f57: string;  // 名称
  f58: string;  // 代码
  f60: number;  // 昨收
  f116: number; // 总市值
  f117: number; // 流通市值
  f162: number; // 市盈率
  f167: number; // 市净率
  f169: number; // 涨跌额
  f170: number; // 涨跌幅
  f171: number; // 换手率
}

interface EastmoneyStockResponse {
  data?: StockResponse;
}

export async function getStock(secid: string): Promise<StockResponse | null> {
  try {
    const fields = 'f43,f44,f45,f46,f47,f48,f50,f57,f58,f60,f116,f117,f162,f167,f169,f170,f171';
    const url = `${STOCK_API}?secid=${secid}&fields=${fields}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://quote.eastmoney.com/',
      },
    });
    const json: EastmoneyStockResponse = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function getStocks(secids: string[]): Promise<(StockResponse | null)[]> {
  return Promise.all(secids.map(getStock));
}

// Index uses same API as stock
export const getZindex = getStock;
export const getZindexs = getStocks;
