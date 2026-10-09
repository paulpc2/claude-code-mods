# usage-both

在 Claude Code 輸入框上方，固定顯示「5 小時」與「每週」兩個用量額度。

![輸入框上方同時顯示 5 小時與每週用量：彩色百分比標籤、分三段的進度條、重置時間](docs/screenshot-zh.png)

## 功能

- 5 小時與每週用量並排在一行，5 小時固定在前，額度用滿時也照常顯示
- 百分比以彩色標籤顯示，進度條撐滿整行寬度
- 顏色分三階段：綠色（低於 60%）、橘色（60% 到 79%）、紅色（80% 以上）；進度條底色也分成同樣三段，段與段之間留有刻度
- 重置時間顯示幾點幾分，依你電腦的時區；超過一天會加上日期
- 剛開啟或重新載入時，先顯示上次的數字，不會閃成 0%
- 介面語言可選繁體中文或英文

## 安裝

需要支援 mod（外掛 hooks）的 Claude Code 版本，終端機版與桌面版 Code 分頁都可用。

```bash
claude plugin marketplace add paulpc2/claude-code-mods
```

```bash
claude plugin install usage-both@paulpc2-mods
```

安裝後在對話中輸入 `/reload-plugins`，或重新開啟 Claude Code。

## 切換語言

預設是繁體中文（`zh-TW`）。要改成英文，在 `/config` 裡找到 usage-both 的 Language 選項，改成 `en`。

## 更新

```bash
claude plugin marketplace update paulpc2-mods
```

```bash
claude plugin update usage-both@paulpc2-mods
```

## 限制

- 用量數字來自 Claude Code 最近一次 API 回應，每回合結束後更新，不是即時輪詢。
- 只適用於 Claude 訂閱方案；使用 API Key、Bedrock 或 Vertex 時沒有這些額度資料。
- 依賴 Claude Code 的外掛介面，日後介面變動時可能需要更新。

---

## English

Shows both the 5-hour and weekly Claude usage above the Claude Code prompt.

- Both windows on one line, 5-hour first, always visible
- Colored percentage badge and full-width progress bar: green (< 60%), orange (60–79%), red (≥ 80%); the track is split into the same three zones with tick gaps at 60% and 80%
- Reset time as clock time in your local time zone, with the date when it is more than a day away
- Last known figures are shown right after a reload instead of 0%
- Traditional Chinese (default) or English: set the plugin's `language` option to `en`

Install:

```bash
claude plugin marketplace add paulpc2/claude-code-mods
```

```bash
claude plugin install usage-both@paulpc2-mods
```

Then run `/reload-plugins` or restart Claude Code.

## License

MIT
