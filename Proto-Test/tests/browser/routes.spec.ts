import { test, expect } from '@playwright/test'

const routes = ['/', '/lista-inteligente', '/operadores', '/operador/pizarron-productores', '/operador/productores', '/productores/granja-santa-rosa', '/operador/mercado', '/productor/mercado', '/operador/publicar', '/ingresar', '/ingresar/2fa', '/seguridad/configurar-2fa', '/recuperar-contrasena', '/restablecer-contrasena', '/operador/vacaciones', '/operadores/ausente', '/administracion/ajuste-de-precios', '/administracion/operadores', '/administracion/productores', '/administracion/lista-inteligente', '/administracion/recuperacion-de-cuentas', '/administracion/revalorizacion-de-precios', '/productos/1/operadores', '/operador/mercado/1/editar', '/productor/mercado/1/editar']

for (const width of [390, 1440]) {
  test(`all ${routes.length} original routes render without errors or overflow at ${width}px`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width, height: 900 })
    for (const route of routes) {
      await page.goto(route)
      await expect(page.locator('main')).toBeVisible()
      expect(errors, route).toEqual([])
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${route}, ${width}px`).toBe(true)
    }
  })
}

test('price sheet remains usable with a short viewport and traps keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/operador/mercado')
  await page.getByRole('button', { name: /Cambiar precio/ }).first().click()
  await page.getByLabel('Nuevo precio').fill('46')
  await page.setViewportSize({ width: 390, height: 430 })
  await page.getByRole('button', { name: 'Confirmar', exact: true }).scrollIntoViewIfNeeded()
  const saveBox = await page.getByRole('button', { name: 'Confirmar', exact: true }).boundingBox()
  expect(saveBox!.y + saveBox!.height).toBeLessThanOrEqual(430)
  for (let step = 0; step < 12; step++) {
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true)
  }
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('dependent filters stay usable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir filtros' }).click()
  const filters = page.locator('.filters.open')
  await page.getByRole('combobox', { name: 'Grupo', exact: true }).selectOption('Frutas de hoja caduca')
  await page.getByRole('combobox', { name: 'Especie', exact: true }).selectOption('Manzana')
  await filters.getByRole('combobox', { name: 'Variedad', exact: true }).selectOption('Fuji')
  await expect(page.locator('.board-product-grid > article')).toHaveCount(1)
  await filters.getByRole('button', { name: 'Limpiar filtros' }).click()
  await expect(page.locator('.board-product-grid > article')).toHaveCount(10)
  await expect(filters.getByRole('combobox', { name: 'Variedad', exact: true })).toBeDisabled()
})
