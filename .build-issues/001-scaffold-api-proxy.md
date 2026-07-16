# feat[1]: 搭建前后端骨架，实现核心数据API代理

## Goal
搭建 Express TypeScript 后端 + Vite React 前端骨架，实现基金/股票/虚拟货币的核心数据 API 代理，前端首页能展示真实数据。

## Acceptance
- [ ] Express 后端能启动，提供 /api/fund, /api/stock, /api/coin 等代理接口
- [ ] 后端复用 src/main/httpClient.ts 请求逻辑，支持自定义 UA
- [ ] Vite 前端能构建成功，dev server 正常运行
- [ ] 前端首页通过后端 API 获取并展示基金数据
- [ ] 前后端分离，前端请求走 /api/* 到后端

## Notes
Iteration 1 for: 将 Electron 桌面应用 Fishing Funds 转换为前后端分离的 Web 应用
