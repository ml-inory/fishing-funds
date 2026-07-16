const FUND_API = 'https://fundgz.1234567.com.cn/js';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

export interface FundResponse {
  fundcode: string;
  name: string;
  jzrq: string;
  dwjz: string;
  gsz: string;
  gszzl: string;
  gztime: string;
}

function parseJsonP(text: string): FundResponse | null {
  try {
    const jsonStr = text.replace(/^jsonpgz\(/, '').replace(/\);?\s*$/, '');
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export async function getFund(code: string): Promise<FundResponse | null> {
  try {
    const url = `${FUND_API}/${code}.js`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': UA,
        Referer: 'https://fund.eastmoney.com/',
      },
    });
    const text = await res.text();
    return parseJsonP(text);
  } catch {
    return null;
  }
}

export async function getFunds(codes: string[]): Promise<FundResponse[]> {
  const results = await Promise.all(codes.map(getFund));
  return results.filter((f): f is FundResponse => f !== null);
}

export async function getFundList(): Promise<any[] | null> {
  try {
    const url = 'https://fund.eastmoney.com/js/fundcode_search.js';
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Referer: 'https://fund.eastmoney.com/' },
    });
    const text = await res.text();
    const jsonStr = text.replace(/^var\s+r\s*=\s*/, '').replace(/;?\s*$/, '');
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('[fund] getFundList error:', String(e));
    return null;
  }
}
