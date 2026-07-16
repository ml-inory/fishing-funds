// Web entry point - adapted from src/renderer/index.tsx
// Removes Electron-specific startup code

// Initialize the web preload bridge FIRST (before any renderer imports)
import './preload';

import { createRoot } from 'react-dom/client';
import { IconContext } from 'react-icons';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import NP from 'number-precision';
import * as echarts from 'echarts/core';
import {
  BarChart, LineChart, PieChart, MapChart, RadarChart,
  ScatterChart, TreemapChart, CandlestickChart, SunburstChart, GaugeChart,
} from 'echarts/charts';
import {
  TitleComponent, TooltipComponent, GridComponent, TransformComponent,
  LegendComponent, DataZoomComponent, MarkLineComponent, MarkPointComponent,
  MarkAreaComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Provider } from 'react-redux';
import chinaMap from '@/static/map/china.json';
import store from '@/store';
import App from '@/app';
import 'dayjs/locale/zh-cn';

// Window globals for JSONP callbacks
import '@/utils/window';

// dayjs
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('zh-cn');

// echarts
echarts.use([
  BarChart, LineChart, PieChart, MapChart, RadarChart,
  ScatterChart, TreemapChart, CandlestickChart, SunburstChart, GaugeChart,
  TitleComponent, TooltipComponent, GridComponent, TransformComponent,
  LegendComponent, DataZoomComponent, MarkLineComponent, MarkPointComponent,
  MarkAreaComponent, LabelLayout, UniversalTransition, SVGRenderer,
]);
echarts.registerMap('china', chinaMap as any);

// np
NP.enableBoundaryChecking(false);

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN}>
    <style>
      {`:root{
        background-color: var(--inner-color);
      }`}
    </style>
    <Provider store={store}>
      <IconContext.Provider value={{ size: '16px' }}>
        <App />
      </IconContext.Provider>
    </Provider>
  </ConfigProvider>
);
