# Fishing Funds Web

基金、股票、虚拟货币实时数据 Web 应用。从 Electron 桌面版迁移而来。

## 快速启动

```bash
# 开发模式
cd .. && ./start-web.sh

# 生产构建
cd .. && ./build-web.sh && ./prod-start.sh
```

访问 http://localhost:3456

## 架构

```
浏览器 (React SPA)
    │  /api/*
    ▼
Express 后端 (:3001)
    │  undici + 代理
    ▼
天天基金 / 东方财富 / CoinGecko
```

## 功能

- 📈 基金实时估值
- 📊 股票行情
- 🪙 虚拟货币价格（CoinGecko）
- 📉 指数数据
- 🌙 暗色/亮色主题
- 🔍 搜索添加基金/币种
