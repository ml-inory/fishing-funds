// Web service layer - calls Express backend API

const API = '/api';

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function px(v: number): number { return v / 100; }
function pct(v: number): number { return v / 100; }

// Cache for fund list (large, avoid repeated fetches)
let fundListCache: any[] | null = null;

export const Fund = {
  async FromEastmoney(code: string): Promise<any> {
    const data = await apiGet(`/fund/${code}`);
    return data ? { fundcode: data.fundcode, name: data.name, jzrq: data.jzrq, dwjz: data.dwjz, gsz: data.gsz, gszzl: data.gszzl, gztime: data.gztime } : null;
  },
  async GetFixFromEastMoney(code: string): Promise<any> { return Fund.FromEastmoney(code); },
  async GetFundInfoByNameFromEaseMoney(_n: string): Promise<any> { return null; },
  async GetRemoteFundsFromEastmoney(): Promise<any> {
    if (fundListCache) return fundListCache;
    try {
      const data = await apiGet<any[]>('/funds/search');
      if (data && data.length > 0) {
        fundListCache = data;
        console.log(`[Fund] Loaded ${data.length} funds from API`);
        return data;
      }
    } catch (e) {
      console.warn('[Fund] Failed to load fund list:', e);
    }
    return [];
  },
  async GetFundRatingFromEasemoney(): Promise<any> { return []; },
  async FromTencent(code: string): Promise<any> { return Fund.FromEastmoney(code); },
  async GetFundDetailFromEastmoney(_code: string): Promise<any> { return {}; },
  async GetIndustryRateFromEaseMoney(_code: string): Promise<any> { return {}; },
};

export const Stock = {
  async FromEastmoney(secid: string): Promise<any> {
    const data = await apiGet(`/stock/${secid}`);
    if (!data) return null;
    return {
      secid, name: data.f58 || data.f57 || '', code: data.f58 || '',
      zx: px(data.f43), zs: px(data.f60), zdf: pct(data.f170), zde: px(data.f169),
      zg: px(data.f44), zd: px(data.f45), jk: px(data.f46),
      cjl: data.f47, cje: data.f48, hs: pct(data.f171), lb: pct(data.f50),
      zsz: data.f116, ltsz: data.f117, syl: data.f162, sjl: data.f167,
      time: new Date().toLocaleTimeString(),
    };
  },
};

let coinListCache: any[] | null = null;

export const Coin = {
  async FromCoingecko(ids: string, unit: string): Promise<any> {
    const data = await apiGet(`/coins/${ids}`);
    if (!data) return [];
    const c = unit.toLowerCase();
    return Object.entries(data).map(([id, info]: [string, any]) => ({
      code: id, price: String(info[c] || 0),
      change24h: String(info[`${c}_24h_change`] || 0),
      vol24h: String(info[`${c}_24h_vol`] || 0),
      marketCap: String(info[`${c}_market_cap`] || 0),
      updateTime: new Date().toLocaleString(),
    }));
  },
  async GetDetailFromCoingecko(code: string): Promise<any> {
    const data = await apiGet(`/coin/detail/${code}`);
    return data ? { id: data.id, symbol: data.symbol, name: data.name, image: data.image, market_data: data.market_data, market_cap_rank: data.market_cap_rank, coingecko_score: data.coingecko_score } : null;
  },
  async GetRemoteCoinsFromCoingecko(): Promise<any> {
  async GetKFromCoingecko(_code: string, _unit: string, _days: string): Promise<any> { return { prices: [] }; },
    if (coinListCache) return coinListCache;
    try {
      const data = await apiGet<any[]>('/coins/list/top');
      if (data && data.length > 0) { coinListCache = data; return data; }
    } catch (e) { console.warn('[Coin] Failed to load coin list:', e); }
    return [];
  },
};

export const Zindex = {
  async FromEastmoney(code: string): Promise<any> {
    const data = await apiGet(`/zindex/${code}`);
    if (!data) return null;
    return { code, name: data.f58 || data.f57 || '', zx: px(data.f43), zs: px(data.f60), zdf: pct(data.f170), zde: px(data.f169), zgj: px(data.f44), zdj: px(data.f45), kpj: px(data.f46), cjl: data.f47, cje: data.f48, zsz: data.f116 };
  },
};

export const Quotation = {
  async GetQuotationsFromEastmoney(_t: string, _p?: number): Promise<any> { return []; },
};

export const Time = {
  async GetCurrentDateTimeFromTaobao(): Promise<any> { return { data: { t: Date.now() } }; },
  async GetCurrentDateTimeFromSuning(): Promise<any> { return { data: { t: Date.now() } }; },
};
