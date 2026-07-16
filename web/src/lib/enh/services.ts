// Web service layer - replaces @lib/enh/services
// Calls our Express backend API proxy instead of direct HTTP requests

const API = '/api';

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const Fund = {
  async FromEastmoney(code: string): Promise<any> {
    return apiGet(`/fund/${code}`);
  },
  async GetFixFromEastMoney(fundcode: string): Promise<any> {
    // Fund fix data - use fund detail endpoint
    return apiGet(`/fund/${fundcode}`);
  },
  async GetFundInfoByNameFromEaseMoney(name: string): Promise<any> {
    // TODO: implement search
    return null;
  },
  async GetRemoteFundsFromEastmoney(): Promise<any> {
    // TODO: implement remote fund list
    return [];
  },
  async GetFundRatingFromEasemoney(): Promise<any> {
    // TODO: implement fund rating
    return [];
  },
  async FromTencent(code: string): Promise<any> {
    return Fund.FromEastmoney(code);
  },
  async FromFund123(code: string): Promise<any> {
    return Fund.FromEastmoney(code);
  },
  async FromFund10jqka(code: string): Promise<any> {
    return Fund.FromEastmoney(code);
  },
};

export const Stock = {
  async FromEastmoney(secid: string): Promise<any> {
    const data = await apiGet(`/stock/${secid}`);
    if (!data) return null;
    // Map Eastmoney fields to expected response format
    return {
      secid,
      name: data.f57 || data.f58 || '',
      zx: data.f43,       // 最新价
      zs: data.f60,       // 昨收
      zdf: data.f170,     // 涨跌幅
      zde: data.f169,     // 涨跌额
      zgj: data.f44,      // 最高
      zdj: data.f45,      // 最低
      kpj: data.f46,      // 开盘
      cjl: data.f47,      // 成交量
      cje: data.f48,      // 成交额
      hsl: data.f171,     // 换手率
      zsz: data.f116,     // 总市值
      ltsz: data.f117,    // 流通市值
      syl: data.f162,     // 市盈率
      sjl: data.f167,     // 市净率
      ...data,
    };
  },
};

export const Coin = {
  async FromCoingecko(ids: string, unit: string): Promise<any> {
    const data = await apiGet(`/coins/${ids}`);
    if (!data) return [];
    // Transform coingecko simple/price response to expected format
    return Object.entries(data).map(([id, info]: [string, any]) => ({
      code: id,
      price: info[unit.toLowerCase()] || 0,
      change24h: info[`${unit.toLowerCase()}_24h_change`] || 0,
      vol24h: info[`${unit.toLowerCase()}_24h_vol`] || 0,
      marketCap: info[`${unit.toLowerCase()}_market_cap`] || 0,
      lastUpdated: info.last_updated_at,
    }));
  },
  async GetDetailFromCoingecko(code: string): Promise<any> {
    const data = await apiGet(`/coin/detail/${code}`);
    if (!data) return null;
    return {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image,
      market_data: data.market_data,
      market_cap_rank: data.market_cap_rank,
      coingecko_score: data.coingecko_score,
    };
  },
  async GetRemoteCoinsFromCoingecko(): Promise<any> {
    // Return top coins
    return apiGet('/coins/bitcoin,ethereum,binancecoin,ripple,cardano,solana');
  },
};

export const Zindex = {
  async FromEastmoney(code: string): Promise<any> {
    const data = await apiGet(`/zindex/${code}`);
    if (!data) return null;
    return {
      code,
      name: data.f57 || data.f58 || '',
      zx: data.f43,
      zs: data.f60,
      zdf: data.f170,
      zde: data.f169,
      zgj: data.f44,
      zdj: data.f45,
      kpj: data.f46,
      cjl: data.f47,
      cje: data.f48,
      zsz: data.f116,
      ...data,
    };
  },
};

export const Quotation = {
  async GetQuotationsFromEastmoney(type: string, page?: number): Promise<any> {
    // TODO: implement quotation data
    return [];
  },
};

export const Time = {
  async GetCurrentDateTimeFromTaobao(): Promise<any> {
    return { data: { t: Date.now() } };
  },
  async GetCurrentDateTimeFromSuning(): Promise<any> {
    return { data: { t: Date.now() } };
  },
};
