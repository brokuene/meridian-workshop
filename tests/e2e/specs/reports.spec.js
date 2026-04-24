import { test, expect } from '@playwright/test'

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    // Wait for the heading, then a short settle for data
    await page.waitForSelector('h2', { timeout: 15_000 })
    await page.waitForTimeout(1000)
  })

  test('page renders without errors', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Report/i })).toBeVisible()
    await expect(page.getByText('Error')).not.toBeVisible()
  })

  test('quarterly table renders with revenue data', async ({ page }) => {
    // Quarterly report table should have Quarter column
    const table = page.locator('table').filter({ hasText: /Quarter|Q1|Q2/i }).first()
    await expect(table).toBeVisible()
    const rows = table.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('monthly chart section renders', async ({ page }) => {
    // Monthly trends section should be visible (either SVG bars or a heading)
    const monthlySection = page.locator('text=/Monthly|Orders by Month/i').first()
    await expect(monthlySection).toBeVisible()
  })

  test('warehouse filter works without error', async ({ page }) => {
    const locationSelect = page.locator('select').nth(1)
    await locationSelect.selectOption('Tokyo')
    await page.waitForTimeout(800)

    await expect(page.getByText('Error')).not.toBeVisible()
    await expect(page.getByRole('heading', { name: /Report/i })).toBeVisible()
  })

  test('category filter works without error', async ({ page }) => {
    const categorySelect = page.locator('select').nth(2)
    await categorySelect.selectOption('Actuators')
    await page.waitForTimeout(800)

    await expect(page.getByText('Error')).not.toBeVisible()
  })
})
