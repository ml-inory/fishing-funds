// Web service layer - calls Express backend API

const API = '/api';

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function px(v: number): number { return v / 100; }
function pct(v: number): number { return v / 100; }

let fundListCache: any[] | null = null;

export const Fund = {
  async FromEastmoney(code: string): Promise<any> {
    const data = await apiGet(`/fund/${code}`);
    if (!data) return null;
    return { fundcode: data.fundcode, name: data.name, jzrq: data.jzrq, dwjz: data.dwjz, gsz: data.gsz, gszzl: data.gszzl, gztime: data.gztime };
  },
  async GetFixFromEastMoney(code: string): Promise<any> { return Fund.FromEastmoney(code); },
  async GetFundInfoByNameFromEaseMoney(_n: string): Promise<any> { return null; },
  async GetRemoteFundsFromEastmoney(): Promise<any> {
    if (fundListCache) return fundListCache;
    try { const data = await apiGet<any[]>('/funds/search'); if (data?.length) { fundListCache = data; return data; } } catch {}
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
  async SearchFromEastmoney(keyword: string): Promise<any> {
    try {
      const data = await apiGet(`/stock/search/${encodeURIComponent(keyword)}`);
      // Transform API response: add Type field mapped from SecurityType (string → number)
      return (data || []).map((item: any) => ({
        ...item,
        Type: parseInt(item.SecurityType) || 0,
      }));
    } catch { return []; }
  },
  GetABCompany: async (_s: string) => null,
  GetHKCompany: async (_s: string) => null,
  GetUSCompany: async (_s: string) => null,
  GetXSBCompany: async (_s: string) => null,
  GetPicTrendFromEastmoney: async (_s: string) => null,
  GetReportDate: async () => [],
  GetStockHoldFunds: async (_s: string, _d: any) => [],
  GetKFromEastmoney: async (_s: string, _k: any, _t: any) => ({ klines: [] }),
  GetIndustryFromEastmoney: async (_s: string, _t?: number) => [],
  GetTrendFromEastmoney: async (_s: string) => ({ trends: [] }),
  GetDetailFromEastmoney: async (_s: string) => ({}),
  GetCloseDayDates: async () => [],
  GetMeetingData: async (_p: any) => [],
  GetMainRankFromEastmoney: async (_d: any) => [],
  GetNorthRankFromEastmoney: async (_d: any) => [],
  GetSelfRankFromEastmoney: async (_d: any) => [],
  GetStockRank: async (_c: string) => [],
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
    if (!data) return null;
    return { id: data.id, symbol: data.symbol, name: data.name, image: data.image, market_data: data.market_data, market_cap_rank: data.market_cap_rank, coingecko_score: data.coingecko_score };
  },
  async GetRemoteCoinsFromCoingecko(): Promise<any> {
    if (coinListCache) return coinListCache;
    try { const data = await apiGet<any[]>('/coins/list/top'); if (data?.length) { coinListCache = data; return data; } } catch {}
    return [];
  },
  GetKFromCoingecko: async (_code: string, _unit: string, _days: string) => ({ prices: [] }),
  GetHistoryFromCoingecko: async (_code: string, _unit: string, _days: string) => ({ prices: [] }),
  FromCoinCap: async (_sort: string, _dir: string) => [],
};

export const Zindex = {
  async FromEastmoney(code: string): Promise<any> {
    const data = await apiGet(`/zindex/${code}`);
    if (!data) return null;
    return { code, name: data.f58 || data.f57 || '', zx: px(data.f43), zs: px(data.f60), zdf: pct(data.f170), zde: px(data.f169), zgj: px(data.f44), zdj: px(data.f45), kpj: px(data.f46), cjl: data.f47, cje: data.f48, zsz: data.f116 };
  },
};

export const Quotation = {
  GetQuotationsFromEastmoney: async (_t: string, _p?: number) => [],
};

export const Time = {
  GetCurrentDateTimeFromTaobao: async () => ({ data: { t: Date.now() } }),
  GetCurrentDateTimeFromSuning: async () => ({ data: { t: Date.now() } }),
};
