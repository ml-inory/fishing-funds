const FUND_API = 'https://fundgz.1234567.com.cn/js';

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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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
