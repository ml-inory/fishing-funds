# feat[2]: 完善端到端数据流，首页展示真实数据

## Goal
跑通完整数据链路：后端 API → 前端 service → Redux store → UI 渲染，确保首页基金/股票/虚拟货币能真实展示数据。

## Acceptance
- [ ] Express 后端能成功返回真实数据（基金估值、股票行情、虚拟货币价格）
- [ ] 前端 InitPage 正常初始化，Redux store 加载默认配置
- [ ] 首页 HomePage 渲染基金列表，显示真实涨跌数据
- [ ] 修复明显的运行时错误（adapter 缺失、API 字段不匹配等）
- [ ] 前端 dev server 代理正常工作

## Notes
Iteration 2 for: 将 Electron 桌面应用 Fishing Funds 转换为前后端分离的 Web 应用
