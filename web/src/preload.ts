// Web-compatible replacement for Electron preload bridge

const STORAGE_PREFIX = 'ff_web_';

// Simple fetch-based request
async function request(url: string, config: any = {}) {
  const { responseType = 'json', headers: reqHeaders, searchParams, method = 'GET', body: reqBody } = config;
  let fullUrl = url;
  if (searchParams) {
    const sp = new URLSearchParams(searchParams);
    fullUrl += (fullUrl.includes('?') ? '&' : '?') + sp.toString();
  }
  try {
    const res = await fetch(fullUrl, { method, headers: reqHeaders, body: reqBody });
    if (responseType === 'json') return { body: await res.json(), headers: res.headers };
    if (responseType === 'arraybuffer') return { body: await res.arrayBuffer(), headers: res.headers };
    return { body: await res.text(), headers: res.headers };
  } catch {
    return {} as any;
  }
}

// Seed sample data on first visit
function seedSampleData() {
  const walletKey = `${STORAGE_PREFIX}config_WALLET_SETTING`;
  if (!localStorage.getItem(walletKey)) {
    const sampleWallet: Wallet.SettingItem = {
      name: '示例钱包',
      iconIndex: 0,
      code: '-1',
      funds: [
        { code: '320007', name: '诺安成长混合A', cyfe: 1000, cbj: 1.6988 },
        { code: '161725', name: '招商中证白酒指数(LOF)A', cyfe: 1000, cbj: 1.4896 },
        { code: '005827', name: '易方达蓝筹精选混合', cyfe: 500, cbj: 2.3500 },
      ],
      stocks: [
        { secid: '1.600519', name: '贵州茅台', code: '600519', market: 1, cyfe: 100, cbj: 1800, type: 1 },
        { secid: '0.000858', name: '五粮液', code: '000858', market: 0, cyfe: 200, cbj: 150, type: 1 },
      ],
    };
    localStorage.setItem(walletKey, JSON.stringify([sampleWallet]));
    localStorage.setItem(`${STORAGE_PREFIX}config_CURRENT_WALLET_CODE`, JSON.stringify('-1'));

    // Seed default zindex config
    const defaultZindex = [
      { code: '1.000001', name: '上证指数' },
      { code: '0.399001', name: '深证成指' },
      { code: '0.399006', name: '创业板指' },
      { code: '1.000688', name: '科创50' },
    ];
    localStorage.setItem(`${STORAGE_PREFIX}config_ZINDEX_SETTING`, JSON.stringify(defaultZindex));

    // Seed default coin config
    const defaultCoins = [
      { code: 'bitcoin', name: 'Bitcoin', symbol: 'btc' },
      { code: 'ethereum', name: 'Ethereum', symbol: 'eth' },
    ];
    localStorage.setItem(`${STORAGE_PREFIX}config_COIN_SETTING`, JSON.stringify(defaultCoins));
  }
}
seedSampleData();

// localStorage-based store
const electronStore = {
  async get(type: string, key: string, init: unknown) {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${type}_${key}`);
    if (raw !== null) {
      try { return JSON.parse(raw); } catch { return raw; }
    }
    return init;
  },
  async set(type: string, key: string, value: unknown) {
    localStorage.setItem(`${STORAGE_PREFIX}${type}_${key}`, JSON.stringify(value));
  },
  async delete(type: string, key: string) {
    localStorage.removeItem(`${STORAGE_PREFIX}${type}_${key}`);
  },
  async cover(type: string, value: unknown) {
    const prefix = `${STORAGE_PREFIX}${type}_`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k?.startsWith(prefix)) localStorage.removeItem(k);
    }
    if (value && typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
        localStorage.setItem(`${prefix}${k}`, JSON.stringify(v));
      });
    }
  },
  async all(type: string) {
    const result: Record<string, unknown> = {};
    const prefix = `${STORAGE_PREFIX}${type}_`;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(prefix)) {
        const raw = localStorage.getItem(k);
        try { result[k.slice(prefix.length)] = raw ? JSON.parse(raw) : raw; } catch { result[k.slice(prefix.length)] = raw; }
      }
    }
    return result;
  },
};

window.contextModules = {
  request,
  process: {
    production: import.meta.env.PROD,
    platform: 'browser' as any,
    electron: '', node: '', v8: '', chrome: '', arch: '',
    buildDate: String(__BUILD_DATE__),
    sandboxed: false,
  },
  electron: {
    shell: { openExternal: (url: string) => window.open(url, '_blank') } as any,
    ipcRenderer: {
      invoke: async (channel: string, ...args: any[]) => {
        switch (channel) {
          case 'is-support-blur-bg': return false;
          case 'get-version': return '1.0.0-web';
          case 'show-message-box': return { response: 0 };
          case 'show-save-dialog': case 'show-open-dialog': return { canceled: true };
          case 'clipboard-writeText': await navigator.clipboard.writeText(args[0]); return;
          case 'clipboard-readText': return await navigator.clipboard.readText();
          case 'set-native-theme-source': case 'set-menubar-visible': case 'set-tray-content': return;
          default: console.warn(`IPC: ${channel}`); return undefined;
        }
      },
      removeAllListeners: () => {}, removeListener: () => {}, on: () => {},
    } as any,
    dialog: {
      showMessageBox: async () => ({ response: 0 }),
      showSaveDialog: async () => ({ canceled: true }),
      showOpenDialog: async () => ({ canceled: true }),
    } as any,
    app: { quit: () => {}, relaunch: () => location.reload(), setLoginItemSettings: () => {}, getVersion: async () => '1.0.0-web' } as any,
    clipboard: {
      writeText: (text: string) => navigator.clipboard.writeText(text),
      readText: () => navigator.clipboard.readText(),
      writeImage: () => {},
    } as any,
  },
  io: {
    saveImage: async () => {},
    saveString: async (_p: string, content: string) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'export.txt'; a.click(); URL.revokeObjectURL(a.href);
    },
    saveJsonToCsv: async () => {},
    readStringFile: async () => '',
    readFile: async () => new ArrayBuffer(0),
  },
  electronStore,
} as any;
