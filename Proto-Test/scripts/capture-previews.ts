import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

await mkdir('docs', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge' })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  for (const [name, path] of [['desktop-market', '/operador/mercado'], ['desktop-board', '/']] as const) {
    await page.goto(`http://127.0.0.1:5174${path}`)
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images).map(img => img.decode().catch(() => {}))) })
    await page.screenshot({ path: `docs/${name}.png`, fullPage: false })
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('http://127.0.0.1:5174/operador/mercado')
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images).slice(0, 3).map(img => img.decode().catch(() => {}))) })
  await page.screenshot({ path: 'docs/mobile-market.png' })
  await page.getByRole('button', { name: /Cambiar precio/ }).first().click()
  await page.getByLabel('Nuevo precio').fill('64')
  await page.getByRole('dialog').evaluate(async el => { await Promise.all(el.getAnimations().map(animation => animation.finished)) })
  await page.screenshot({ path: 'docs/mobile-price-editor.png' })
  await page.goto('http://127.0.0.1:5174/')
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images).slice(0, 5).map(img => img.decode().catch(() => {}))) })
  await page.screenshot({ path: 'docs/mobile-board.png' })
} finally { await browser.close() }
