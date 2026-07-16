const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface CoinSimpleItem {
  [currency: string]: number;
}

export interface CoinSimpleResponse {
  [id: string]: CoinSimpleItem;
}

export interface CoinDetailResponse {
  id: string;
  symbol: string;
  name: string;
  image: { thumb: string; small: string; large: string };
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    price_change_percentage_24h: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: Record<string, number>;
    ath_change_percentage: Record<string, number>;
    ath_date: Record<string, string>;
  };
  market_cap_rank: number;
  coingecko_score: number;
}

export async function getCoins(ids: string, currency = 'usd'): Promise<CoinSimpleResponse | null> {
  try {
    const url = `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=${currency}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });
    return await res.json();
  } catch {
    return null;
  }
}

export async function getCoinDetail(id: string): Promise<CoinDetailResponse | null> {
  try {
    const url = `${COINGECKO_API}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });
    return await res.json();
  } catch {
    return null;
  }
}
