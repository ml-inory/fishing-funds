// Web service layer - replaces @lib/enh/services
// Calls our Express backend API proxy

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
    const data = await apiGet(`/fund/${code}`);
    if (!data) return null;
    // Backend returns fields matching Fund.ResponseItem directly
    return {
      fundcode: data.fundcode,
      name: data.name,
      jzrq: data.jzrq,
      dwjz: data.dwjz,
      gsz: data.gsz,
      gszzl: data.gszzl,
      gztime: data.gztime,
    };
  },
  async GetFixFromEastMoney(fundcode: string): Promise<any> {
    // Fund fix data uses same endpoint
    return Fund.FromEastmoney(fundcode);
  },
  async GetFundInfoByNameFromEaseMoney(name: string): Promise<any> {
    return null;
  },
  async GetRemoteFundsFromEastmoney(): Promise<any> {
    return [];
  },
  async GetFundRatingFromEasemoney(): Promise<any> {
    return [];
  },
  async FromTencent(code: string): Promise<any> {
    return Fund.FromEastmoney(code);
  },
};

export const Stock = {
  async FromEastmoney(secid: string): Promise<any> {
    const data = await apiGet(`/stock/${secid}`);
    if (!data) return null;
    return {
      secid,
      name: data.f58 || data.f57 || '',
      code: data.f58 || '',
      zx: data.f43,       // 最新价
      zs: data.f60,       // 昨收
      zdf: data.f170,     // 涨跌幅
      zde: data.f169,     // 涨跌额
      zg: data.f44,       // 最高
      zd: data.f45,       // 最低
      jk: data.f46,       // 今开
      cjl: data.f47,      // 成交量
      cje: data.f48,      // 成交额
      hs: data.f171,      // 换手率
      lb: data.f50,       // 量比
      zsz: data.f116,     // 总市值
      ltsz: data.f117,    // 流通市值
      syl: data.f162,     // 市盈率
      sjl: data.f167,     // 市净率
      time: new Date().toLocaleTimeString(),
    };
  },
};

export const Coin = {
  async FromCoingecko(ids: string, unit: string): Promise<any> {
    const data = await apiGet(`/coins/${ids}`);
    if (!data) return [];
    const currency = unit.toLowerCase();
    return Object.entries(data).map(([id, info]: [string, any]) => ({
      code: id,
      price: String(info[currency] || 0),
      change24h: String(info[`${currency}_24h_change`] || 0),
      vol24h: String(info[`${currency}_24h_vol`] || 0),
      marketCap: String(info[`${currency}_market_cap`] || 0),
      updateTime: new Date().toLocaleString(),
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
    return [];
  },
};

export const Zindex = {
  async FromEastmoney(code: string): Promise<any> {
    const data = await apiGet(`/zindex/${code}`);
    if (!data) return null;
    return {
      code,
      name: data.f58 || data.f57 || '',
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
    };
  },
};

export const Quotation = {
  async GetQuotationsFromEastmoney(_type: string, _page?: number): Promise<any> {
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
