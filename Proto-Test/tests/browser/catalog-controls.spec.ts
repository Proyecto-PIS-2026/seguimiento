import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

test('admin increment persists and updates plus/minus in both actor views', async ({ page, context }) => {
  await page.goto('/operador/mercado')
  await page.getByRole('button', { name: 'V2', exact: true }).click()
  const admin = await context.newPage()
  await admin.goto('/administracion/ajuste-de-precios')
  await admin.getByRole('button', { name: 'Cambiar incremento: $10', exact: true }).click()
  await expect(admin.getByLabel('Importe del ajuste')).toBeFocused()
  for (const value of ['0', '-5', '2.5']) {
    await admin.getByLabel('Importe del ajuste').fill(value)
    await admin.getByRole('button', { name: 'Confirmar', exact: true }).click()
    await expect(admin.getByRole('alert')).toContainText('entero mayor a 0')
  }
  await admin.getByLabel('Importe del ajuste').fill('7')
  await admin.getByRole('button', { name: 'Confirmar', exact: true }).click()
  await expect(page.getByRole('button', { name: /Aumentar \$7:/ }).first()).toBeVisible()
  await admin.reload()
  await admin.getByRole('button', { name: 'Cambiar incremento: $7', exact: true }).click()
  await admin.getByLabel('Importe del ajuste').fill('20')
  await admin.getByRole('button', { name: 'Cancelar', exact: true }).click()
  await expect(admin.getByRole('button', { name: 'Cambiar incremento: $7', exact: true })).toBeVisible()
  for (const role of ['operador', 'productor']) {
    await page.goto(`/${role}/mercado`)
    const row = page.locator('.actor-product-price-list > span').first()
    const initial = Number((await row.locator('b').innerText()).replace('$', ''))
    await row.getByRole('button', { name: /Aumentar \$7:/ }).click()
    await expect(row.locator('b')).toHaveText(`$${initial + 7}`)
    await row.getByRole('button', { name: /Restar \$7:/ }).click()
    await expect(row.locator('b')).toHaveText(`$${initial}`)
  }
})

test('visible bounds filter actual combination prices and preserve the dependent species filter', async ({ page }) => {
  for (const route of ['/operador/mercado', '/productor/mercado']) {
    await page.goto(route)
    await expect(page.getByRole('combobox', { name: 'Grupo', exact: true })).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'Especie', exact: true })).toBeVisible()
    await page.getByLabel('Precio mínimo', { exact: true }).fill('60')
    await page.getByLabel('Precio máximo', { exact: true }).fill('70')
    const prices = page.locator('.actor-product-price-list b')
    await expect(prices.first()).toBeVisible()
    for (const text of await prices.allTextContents()) expect(Number(text.replace('$', ''))).toBeGreaterThanOrEqual(60)
    for (const text of await prices.allTextContents()) expect(Number(text.replace('$', ''))).toBeLessThanOrEqual(70)
    await page.locator('.actor-product-price-list > span').first().getByRole('button', { name: /Cambiar precio/ }).click()
    await page.getByLabel('Nuevo precio').fill('99')
    await page.getByRole('button', { name: 'Confirmar', exact: true }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    expect(await prices.allTextContents()).not.toContain('$99')
    await page.getByLabel('Precio mínimo', { exact: true }).fill('80')
    await expect(page.getByRole('alert')).toContainText('El mínimo no puede superar el máximo')
    await expect(prices).toHaveCount(0)
    await page.getByRole('button', { name: 'Limpiar filtros', exact: true }).click()
    await expect(prices.first()).toBeVisible()
  }
  await page.goto('/')
  await page.getByRole('combobox', { name: 'Grupo', exact: true }).selectOption('Frutas de hoja caduca')
  await page.getByRole('combobox', { name: 'Especie', exact: true }).selectOption('Manzana')
  await page.getByLabel('Precio mínimo').fill('55')
  await page.getByLabel('Precio máximo').fill('60')
  await expect(page.locator('.board-product-grid > article')).toHaveCount(1)
  await page.getByLabel('Precio mínimo').fill('65')
  await page.getByLabel('Precio máximo').fill('70')
  await expect(page.locator('.board-product-grid > article')).toHaveCount(0)
})

test('add actions use available width without truncating text and preselect the species', async ({ page }) => {
  await page.goto('/operador/mercado')
  for (const width of [320, 390, 700, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 })
    for (const button of [page.getByRole('button', { name: 'Agregar Producto', exact: true }), page.getByRole('button', { name: 'Agregar Ananá', exact: true })]) {
      expect(await button.evaluate(el => el.scrollWidth <= el.clientWidth && el.scrollHeight <= el.clientHeight)).toBe(true)
      expect((await button.boundingBox())!.width).toBeGreaterThan(100)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Agregar Ananá', exact: true }).click()
  await expect(page.getByRole('dialog').getByLabel('Especie', { exact: true })).toHaveValue('19')
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await page.getByRole('button', { name: 'Abrir filtros', exact: true }).click()
  expect(await page.getByRole('combobox', { name: 'Nave', exact: true }).locator('option').allTextContents()).toEqual(['Todas', 'Nave A', 'Nave B', 'Nave C', 'Nave E'])
})
