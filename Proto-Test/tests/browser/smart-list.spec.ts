import { test, expect } from '@playwright/test'
import { DEFAULT_SMART_LIST_URL, SMART_LIST_STORAGE_KEY } from '../../src/features/board/smartListSettings'

test('admin updates the PDF, public buttons and open tabs follow it, and reload preserves it', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/lista-inteligente')
  const pdf = page.getByRole('link', { name: 'Ver lista inteligente de la UAM' })
  await expect(pdf).toHaveAttribute('href', DEFAULT_SMART_LIST_URL)
  await expect(page.locator('.smart-picks, .smart-search')).toHaveCount(0)
  const admin = await context.newPage()
  await admin.setViewportSize({ width: 390, height: 844 })
  await admin.goto('/administracion/lista-inteligente')
  await expect(admin.getByLabel('Enlace al PDF')).toHaveValue(DEFAULT_SMART_LIST_URL)
  const updated = `${DEFAULT_SMART_LIST_URL}?semana=2`
  await admin.getByLabel('Enlace al PDF').fill(updated)
  await admin.getByRole('button', { name: 'Guardar enlace' }).click()
  await expect(admin.getByRole('status')).toContainText('actualizado')
  await expect(pdf).toHaveAttribute('href', updated)
  await admin.reload()
  await expect(admin.getByLabel('Enlace al PDF')).toHaveValue(updated)
  expect(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.goto('/')
  await expect(pdf).toHaveAttribute('href', updated)
  await context.route(updated, route => route.fulfill({ contentType: 'text/html', body: 'PDF de prueba' }))
  const popup = page.waitForEvent('popup')
  await page.getByRole('button', { name: 'De estación', exact: true }).click()
  await expect(await popup).toHaveURL(updated)
})

test('invalid links and storage failures never replace the saved PDF', async ({ page }) => {
  await page.goto('/administracion/lista-inteligente')
  for (const invalid of ['', 'javascript:alert(1)', 'https://uam.com.uy/documento', 'http://uam.com.uy/lista.pdf']) {
    await page.getByLabel('Enlace al PDF').fill(invalid)
    await page.getByRole('button', { name: 'Guardar enlace' }).click()
    await expect(page.getByRole('alert')).toContainText('enlace HTTPS')
    await expect(page.getByRole('link', { name: 'Abrir PDF actual' })).toHaveAttribute('href', DEFAULT_SMART_LIST_URL)
  }
  await page.evaluate(key => {
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (name, value) { if (name === key) throw new Error('storage blocked'); return original.call(this, name, value) }
  }, SMART_LIST_STORAGE_KEY)
  await page.getByLabel('Enlace al PDF').fill(`${DEFAULT_SMART_LIST_URL}?semana=3`)
  await page.getByRole('button', { name: 'Guardar enlace' }).click()
  await expect(page.getByRole('alert')).toContainText('No pudimos guardar')
  await expect(page.getByRole('link', { name: 'Abrir PDF actual' })).toHaveAttribute('href', DEFAULT_SMART_LIST_URL)
})
