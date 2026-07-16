// Web-compatible replacement for Electron preload bridge
// Provides the same `window.contextModules` API using browser-native equivalents

const API_BASE = '/api';

// Simple fetch-based request replacement
async function request(url: string, config: any = {}) {
  const { responseType = 'json', headers: reqHeaders, searchParams, method = 'GET', body: reqBody } = config;

  let fullUrl = url;
  if (searchParams) {
    const sp = new URLSearchParams(searchParams);
    fullUrl += (fullUrl.includes('?') ? '&' : '?') + sp.toString();
  }

  try {
    const res = await fetch(fullUrl, {
      method,
      headers: reqHeaders,
      body: reqBody,
    });

    if (responseType === 'json') {
      return { body: await res.json(), headers: res.headers };
    } else if (responseType === 'arraybuffer') {
      return { body: await res.arrayBuffer(), headers: res.headers };
    } else {
      return { body: await res.text(), headers: res.headers };
    }
  } catch {
    return {} as any;
  }
}

// localStorage-based store replacement
const storagePrefix = 'ff_web_';
const electronStore = {
  async get(type: string, key: string, init: unknown) {
    const raw = localStorage.getItem(`${storagePrefix}${type}_${key}`);
    if (raw !== null) {
      try { return JSON.parse(raw); } catch { return raw; }
    }
    return init;
  },
  async set(type: string, key: string, value: unknown) {
    localStorage.setItem(`${storagePrefix}${type}_${key}`, JSON.stringify(value));
  },
  async delete(type: string, key: string) {
    localStorage.removeItem(`${storagePrefix}${type}_${key}`);
  },
  async cover(type: string, value: unknown) {
    // Delete all keys for this type, then set
    const prefix = `${storagePrefix}${type}_`;
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
    const prefix = `${storagePrefix}${type}_`;
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
    electron: '',
    node: '',
    v8: '',
    chrome: '',
    arch: '',
    buildDate: String(__BUILD_DATE__),
    sandboxed: false,
  },
  electron: {
    shell: {
      openExternal: (url: string) => window.open(url, '_blank'),
    } as any,
    ipcRenderer: {
      invoke: async (channel: string, ...args: any[]) => {
        // Handle common IPC channels
        switch (channel) {
          case 'is-support-blur-bg':
            return false;
          case 'get-version':
            return '1.0.0-web';
          case 'show-message-box':
            return { response: 0 };
          case 'show-save-dialog':
          case 'show-open-dialog':
            return { canceled: true };
          case 'clipboard-writeText':
            await navigator.clipboard.writeText(args[0]);
            return;
          case 'clipboard-readText':
            return await navigator.clipboard.readText();
          case 'set-native-theme-source':
            return;
          case 'set-menubar-visible':
            return;
          case 'set-tray-content':
            return;
          default:
            console.warn(`IPC invoke not implemented for: ${channel}`);
            return undefined;
        }
      },
      removeAllListeners: () => {},
      removeListener: () => {},
      on: () => {},
    } as any,
    dialog: {
      showMessageBox: async () => ({ response: 0 }),
      showSaveDialog: async () => ({ canceled: true }),
      showOpenDialog: async () => ({ canceled: true }),
    } as any,
    app: {
      quit: () => {},
      relaunch: () => location.reload(),
      setLoginItemSettings: () => {},
      getVersion: async () => '1.0.0-web',
    } as any,
    clipboard: {
      writeText: (text: string) => navigator.clipboard.writeText(text),
      readText: () => navigator.clipboard.readText(),
      writeImage: () => {},
    } as any,
  },
  io: {
    saveImage: async () => {},
    saveString: async (_path: string, content: string) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.txt';
      a.click();
      URL.revokeObjectURL(url);
    },
    saveJsonToCsv: async (_path: string, _json: any[]) => {},
    readStringFile: async () => '',
    readFile: async () => new ArrayBuffer(0),
  },
  electronStore,
} as any;
