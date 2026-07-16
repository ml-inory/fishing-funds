// Web-specific HomePage - skips Electron-only hooks (tray, touchbar, updater, etc.)

import Home from '@/components/Home';

import {
  useAdjustmentNotification,
  useRiskNotification,
  useClipboardCopyFunds,
  useBootStrap,
  useAllConfigBackup,
  useMappingLocalToSystemSetting,
  useSyncConfig,
  useTranslate,
  useForceReloadApp,
} from '@/utils/hooks';

function GlobalTask() {
  useAdjustmentNotification();
  useRiskNotification();
  useClipboardCopyFunds();
  useAllConfigBackup();
  useMappingLocalToSystemSetting();
  useSyncConfig();
  useTranslate();
  useForceReloadApp();
  useBootStrap();
  return null;
}

const HomePage = () => {
  return (
    <>
      <Home />
      <GlobalTask />
    </>
  );
};

export default HomePage;
