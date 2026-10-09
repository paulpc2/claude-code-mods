import { test, expect, mock } from 'claude-code/testing'

const PROPS = {
  hasSurvey: false,
  isWorking: false,
  maxRows: 10,
  bodyColumns: 90,
  scroll: { offset: 0, bodyRows: 9, contentRows: 1 },
  view: {},
} as any

const SURFACES = ['terminal', 'desktop'] as const

test('zh-TW: both windows always drawn', async $ => {
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ plugin: 'usage-both', surface, component: 'AbovePrompt', props: PROPS })
    expect(await ui.find({ type: 'Text', text: /5小時/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /每週/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /重置/ })).toBeDefined()
    await ui.unmount()
  }
})

test('en: labels switch to English', { options: { language: 'en' } }, async $ => {
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ plugin: 'usage-both', surface, component: 'AbovePrompt', props: PROPS })
    expect(await ui.find({ type: 'Text', text: /5h/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /Weekly/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /reset/ })).toBeDefined()
    await ui.unmount()
  }
})


test('en via USAGE_BOTH_LANGUAGE env', async ($, on) => {
  mock.env(on, { USAGE_BOTH_LANGUAGE: 'en' })
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ plugin: 'usage-both', surface, component: 'AbovePrompt', props: PROPS })
    expect(await ui.find({ type: 'Text', text: /Weekly/ })).toBeDefined()
    await ui.unmount()
  }
})
