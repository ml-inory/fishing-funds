// Web-compatible enhancement module
// Overrides @/utils/enhancement for browser environment

import { encodeFF, decodeFF, encryptFF, decryptFF } from '@/utils/coding';
import * as Enums from '@/utils/enums';

const { ipcRenderer, app } = window.contextModules.electron;
const { saveString, readStringFile } = window.contextModules.io;
const electronStore = window.contextModules.electronStore;

export async function UpdateSystemTheme(setting: Enums.SystemThemeType) {
  await ipcRenderer.invoke('set-native-theme-source', setting);
}

export async function GenerateBackupConfig() {
  const config = await electronStore.all('config');
  return {
    name: 'Fishing-Funds-Web-Backup',
    author: '1zilc',
    website: 'https://ff.1zilc.top',
    github: 'https://github.com/1zilc/fishing-funds',
    version: await app.getVersion(),
    content: await encodeFF(config),
    timestamp: Date.now(),
    suffix: 'ff',
  } as Backup.Config;
}

export async function GenerateSyncConfig(config: { [x: string]: any }) {
  return {
    name: 'Fishing-Funds-Web-Sync',
    author: '1zilc',
    website: 'https://ff.1zilc.top',
    github: 'https://github.com/1zilc/fishing-funds',
    version: await app.getVersion(),
    content: await encodeFF(config),
    timestamp: Date.now(),
    suffix: 'ff',
  } as Backup.Config;
}

export function CheckEnvTool() {
  // No-op: electron-log not available in browser
}

export async function CoverBackupConfig(fileConfig: Backup.Config) {
  const content = await decodeFF(fileConfig.content);
  return electronStore.cover('config', content);
}

export async function SaveSyncConfig(path: string, config: Backup.Config) {
  const encodeSyncConfig = await encryptFF(config);
  await saveString(path, encodeSyncConfig);
}

export async function loadSyncConfig<T = unknown>(path: string) {
  const encodeSyncConfig = await readStringFile(path);
  const syncConfig: Backup.Config = await decryptFF(encodeSyncConfig);
  return await decodeFF<T>(syncConfig.content);
}
