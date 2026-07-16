import { request, ProxyAgent } from 'undici';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

export interface CoinSimpleItem { [currency: string]: number; }
export interface CoinSimpleResponse { [id: string]: CoinSimpleItem; }
export interface CoinDetailResponse {
  id: string; symbol: string; name: string;
  image: { thumb: string; small: string; large: string };
  market_data: {
    current_price: Record<string, number>; market_cap: Record<string, number>;
    total_volume: Record<string, number>; price_change_percentage_24h: number;
    circulating_supply: number; total_supply: number | null; max_supply: number | null;
    ath: Record<string, number>; ath_change_percentage: Record<string, number>;
    ath_date: Record<string, string>;
  };
  market_cap_rank: number; coingecko_score: number;
}

function getDispatcher() {
  const proxyUrl = process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY;
  if (proxyUrl) { try { return new ProxyAgent(proxyUrl); } catch {} }
  return undefined;
}

async function fetchJson(url: string): Promise<any> {
  const dispatcher = getDispatcher();
  const res = await request(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': UA },
    dispatcher, headersTimeout: 15000, bodyTimeout: 15000,
  });
  const body = await res.body.json();
  return body;
}

export async function getCoins(ids: string, currency = 'usd'): Promise<CoinSimpleResponse | null> {
  try {
    const url = `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=${currency}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;
    return await fetchJson(url);
  } catch (e) { console.error('[coin] getCoins:', String(e)); return null; }
}

export async function getCoinDetail(id: string): Promise<CoinDetailResponse | null> {
  try {
    const url = `${COINGECKO_API}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`;
    return await fetchJson(url);
  } catch (e) { console.error('[coin] getCoinDetail:', String(e)); return null; }
}

export async function getTopCoins(): Promise<any[] | null> {
  try {
    const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1`;
    return await fetchJson(url);
  } catch (e) { console.error('[coin] getTopCoins:', String(e)); return null; }
}
