import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/ExploraModelo/)
})

test('navigate through steps', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Ir al paso 2').click()
  await expect(page.getByText('Temperatura')).toBeVisible()
  await page.getByLabel('Ir al paso 3').click()
  await expect(page.getByText('Interpretación del comportamiento')).toBeVisible()
})

test('export PNG', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Ir al paso 3').click()
  await page.getByText('Exportar').click()
  await page.getByText('PNG').click()
  // Check if download starts (hard to test fully)
})