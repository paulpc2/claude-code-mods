# usage-both

在 Claude Code 輸入框上方，固定顯示「5 小時」與「每週」兩個用量額度。

![輸入框上方同時顯示 5 小時與每週用量：彩色百分比標籤、分三段的進度條、重置時間](docs/screenshot-zh.png)

## 功能

- 5 小時與每週用量並排在一行，5 小時固定在前，額度用滿時也照常顯示
- 百分比以彩色標籤顯示，進度條撐滿整行寬度，桌面版進度條兩端為圓角
- 顏色分三階段：綠色（低於 60%）、橘色（60% 到 79%）、紅色（80% 以上）；進度條底色也分成同樣三段，段與段之間留有刻度
- 重置時間顯示幾點幾分，依你電腦的時區；超過一天會加上日期
- 剛開啟或重新載入時，先顯示上次的數字，不會閃成 0%
- 介面語言可選繁體中文或英文（見下方「切換語言」）

## 安裝

需要支援 mod（外掛 hooks）的 Claude Code 版本，終端機版與桌面版 Code 分頁都可用。

**以下兩行指令要在「終端機」執行**（Mac 內建的「終端機」App，或任何終端機），不是貼到 Claude Code 的對話框。一次貼一行，按 Enter。

1. 加入來源

```bash
claude plugin marketplace add paulpc2/claude-code-mods
```

2. 安裝外掛

```bash
claude plugin install usage-both@paulpc2-mods
```

3. 回到 Claude Code，在對話框輸入 `/reload-plugins`，或完全關閉後重新開啟 Claude Code。

輸入框上方出現兩條用量，就代表成功。安裝時看到「1 userConfig option not yet set」可以忽略，那是語言選項，預設是繁體中文。

## 切換語言（Language）

> **預設是繁體中文。想改成英文，請照下面三個步驟做。**
>
> 桌面版的外掛頁面沒有語言選項，所以要改設定檔。

1. 在「終端機」執行，用「文字編輯」打開設定檔：

```bash
open -e ~/.claude/settings.json
```

2. 在檔案裡加入 `env` 這一段：

```json
{
  "env": { "USAGE_BOTH_LANGUAGE": "en" }
}
```

   如果檔案裡已經有 `env`，只要在裡面多加一行 `"USAGE_BOTH_LANGUAGE": "en"`，行與行之間記得加逗號。

3. 存檔，然後**完全關閉並重新開啟** Claude Code（Mac 按 `Cmd + Q`）。只輸入 `/reload-plugins` 不會生效。

要改回中文，把值改成 `"zh-TW"`，或直接刪掉那一行，一樣要完全重開。

## 更新

同樣在「終端機」依序執行：

```bash
claude plugin marketplace update paulpc2-mods
```

```bash
claude plugin update usage-both@paulpc2-mods
```

更新後一樣要完全重開 Claude Code。

## 限制

- 用量數字來自 Claude Code 最近一次 API 回應，每回合結束後更新，不是即時輪詢。
- 只適用於 Claude 訂閱方案；使用 API Key、Bedrock 或 Vertex 時沒有這些額度資料。
- 依賴 Claude Code 的外掛介面，日後介面變動時可能需要更新。

---

## English

Shows both the 5-hour and weekly Claude usage above the Claude Code prompt.

![Above the prompt: 5-hour and weekly usage with colored percentage badges, three-zone progress bars and reset times](docs/screenshot-en.png)

- Both windows on one line, 5-hour first, always visible
- Colored percentage badge and full-width progress bar (rounded ends in the desktop app): green (< 60%), orange (60–79%), red (≥ 80%); the track is split into the same three zones with tick gaps at 60% and 80%
- Reset time as clock time in your local time zone, with the date when it is more than a day away
- Last known figures are shown right after a reload instead of 0%
- Traditional Chinese (default) or English (see "Language" below)

## Install

Run the two commands below **in a terminal** (the macOS Terminal app or any terminal), not in the Claude Code chat box. Paste one line at a time and press Enter.

1. Add the source

```bash
claude plugin marketplace add paulpc2/claude-code-mods
```

2. Install the plugin

```bash
claude plugin install usage-both@paulpc2-mods
```

3. Back in Claude Code, type `/reload-plugins` in the chat box, or quit and reopen Claude Code.

When two usage rows appear above the prompt, it worked. You can ignore the "1 userConfig option not yet set" note shown during install; it refers to the language option, which defaults to Traditional Chinese.

## Language

> **The default is Traditional Chinese. To switch to English, follow the three steps below.**
>
> The desktop app's plugin page has no language option, so the setting goes in a config file.

1. In a terminal, open the settings file in TextEdit:

```bash
open -e ~/.claude/settings.json
```

2. Add this `env` block:

```json
{
  "env": { "USAGE_BOTH_LANGUAGE": "en" }
}
```

   If the file already has an `env` block, just add `"USAGE_BOTH_LANGUAGE": "en"` inside it, with a comma between entries.

3. Save, then **quit and reopen Claude Code completely** (on a Mac press `Cmd + Q`). Running `/reload-plugins` alone does not apply it.

To switch back, set the value to `"zh-TW"` or delete the line, then restart the same way.

## Update

In a terminal, run these in order:

```bash
claude plugin marketplace update paulpc2-mods
```

```bash
claude plugin update usage-both@paulpc2-mods
```

Then quit and reopen Claude Code.

## License

MIT
