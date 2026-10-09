import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Limit } from '../types'

const limits = atom({ plugin: 'usage-both', key: 'limits' } as const, [] as Limit[])

const KINDS = ['five_hour', 'seven_day']
type Lang = 'zh-TW' | 'en'

const TEXT = {
  'zh-TW': { five_hour: '5小時', seven_day: '每週', used: '已用', reset: '重置' },
  en: { five_hour: '5h', seven_day: 'Weekly', used: 'used', reset: 'reset' },
} as const

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const pad = (n: number) => String(n).padStart(2, '0')

// 重置時間一律顯示幾點幾分（使用這台電腦的時區）；一天以上才加日期
const reset = (lang: Lang, iso?: string) => {
  const word = TEXT[lang].reset
  const t = iso ? Date.parse(iso) : NaN
  if (!(t > 0)) return `--:-- ${word}`
  const d = new Date(t)
  const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  if (t - Date.now() < 86400000) return `${hm} ${word}`
  return lang === 'en'
    ? `${MONTHS[d.getMonth()]} ${d.getDate()} ${hm} ${word}`
    : `${d.getMonth() + 1}月${d.getDate()}日 ${hm} ${word}`
}

// 綠 < 60%，橘 60–79%，紅 ≥ 80%（用量）；底色不透明度 80%（#CC）
const tone = (pct: number) => (pct >= 80 ? '#D92D2DCC' : pct >= 60 ? '#E8820CCC' : '#2A9D45CC')

// 進度條底色分三段（0–60、60–80、80–100），段與段之間留一格空隙當刻度；底色用 25% 不透明
const ZONES: [number, number, string][] = [
  [0, 60, '#2A9D4540'],
  [60, 80, '#E8820C40'],
  [80, 100, '#D92D2D40'],
]

async function refresh($: any) {
  const u = await $.session.usage()
  const fresh: Limit[] = u.rateLimits.map((r: Limit) => ({
    kind: r.kind,
    percentUsed: r.percentUsed,
    resetsAt: r.resetsAt,
  }))
  // 剛重新載入時還沒有新讀數：先用上次存下的數字，不顯示 0%
  let saved: Limit[] = []
  try {
    saved = JSON.parse(String((await $.store.get('limits')) ?? '[]'))
  } catch {}
  if (fresh.length > 0) await $.store.set('limits', JSON.stringify(fresh))
  await update($, limits, (cur: Limit[]) => {
    const prev = cur.length > 0 ? cur : saved
    const next = [...fresh]
    // 視窗暫時從回報消失（例如額度用完）時，保留上一次的數字，不讓它消失
    for (const p of prev) {
      if (!KINDS.includes(p.kind) || next.some(n => n.kind === p.kind)) continue
      const isExpired = p.resetsAt !== undefined && Date.parse(p.resetsAt) <= Date.now()
      next.push(isExpired ? { kind: p.kind, percentUsed: 0 } : p)
    }
    return next
  })
}

export const register: Register = (on, options) => {
  const lang: Lang = options.language === 'en' ? 'en' : 'zh-TW'
  const T = TEXT[lang]

  on('session.start', async ($, e, next) => {
    await refresh($)
    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    await refresh($)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const list = await read($, limits)

    const { Box, Text } = $.ui.resolve(e)
    // 兩個額度永遠都畫，沒有資料時用空條佔位；5 小時固定在前
    const rows = KINDS.map(k => list.find(l => l.kind === k) ?? { kind: k, percentUsed: 0 })

    // 兩段平分整列寬度；文字（含重置時間）完整顯示，進度條撐滿剩下的空間
    return (
      <Box flexDirection="row" alignItems="center" width="100%">
        {rows.map((l, i) => {
          const used = Math.max(0, Math.min(100, l.percentUsed))
          return (
            <Box key={l.kind} flexDirection="row" alignItems="center" flexGrow={1} marginLeft={i === 0 ? 0 : 4}>
              <Text bold>{T[l.kind as 'five_hour' | 'seven_day']}</Text>
              <Text>  </Text>
              <Text bold>{T.used}</Text>
              <Text> </Text>
              <Text bold color="#FFFFFF" backgroundColor={tone(l.percentUsed)}> {l.percentUsed}% </Text>
              <Text>  </Text>
              <Box flexDirection="row" flexGrow={1} height={1} alignItems="center">
                {ZONES.flatMap(([a, b, tint], z) => {
                  const filled = Math.max(0, Math.min(used, b) - a)
                  const empty = b - a - filled
                  return [
                    z > 0 && <Box key={`g${z}`} width={1} height="60%" />,
                    filled > 0 && <Box key={`f${z}`} flexGrow={filled} height="60%" backgroundColor={tone(l.percentUsed)} />,
                    empty > 0 && <Box key={`e${z}`} flexGrow={empty} height="60%" backgroundColor={tint} />,
                  ]
                })}
              </Box>
              <Box flexShrink={0}>
                <Text bold>  {reset(lang, l.resetsAt)}</Text>
              </Box>
            </Box>
          )
        })}
      </Box>
    )
  })
}
