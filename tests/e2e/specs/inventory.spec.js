import { test, expect } from '@playwright/test'

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await page.waitForSelector('table tbody tr')
  })

  test('page renders title and table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Inventory' })).toBeVisible()
    await expect(page.locator('table')).toBeVisible()
    // Header columns
    await expect(page.getByRole('columnheader', { name: 'SKU' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Item Name' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Location' })).toBeVisible()
  })

  test('rows are present before any filter', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('warehouse filter reduces row count', async ({ page }) => {
    const allRows = page.locator('table tbody tr')
    const totalCount = await allRows.count()

    // Apply San Francisco filter (server-side — API is called with warehouse param)
    const locationSelect = page.locator('select').nth(1)
    await locationSelect.selectOption('San Francisco')
    await page.waitForTimeout(700)

    const filteredCount = await allRows.count()
    expect(filteredCount).toBeGreaterThan(0)
    // San Francisco is a subset of all warehouses
    expect(filteredCount).toBeLessThan(totalCount)
  })

  test('category filter shows only matching items', async ({ page }) => {
    const categorySelect = page.locator('select').nth(2)
    await categorySelect.selectOption('Sensors')
    await page.waitForTimeout(500)

    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()

    const categoryCells = page.locator('table tbody tr td:nth-child(3)')
    const cellTexts = await categoryCells.allTextContents()
    for (const text of cellTexts) {
      expect(text).toBe('Sensors')
    }
  })

  test('combined warehouse + category filter', async ({ page }) => {
    const locationSelect = page.locator('select').nth(1)
    const categorySelect = page.locator('select').nth(2)

    await locationSelect.selectOption('London')
    await categorySelect.selectOption('Circuit Boards')
    await page.waitForTimeout(500)

    // Should show results or empty state, not an error
    const hasRows = await page.locator('table tbody tr').count() > 0
    const hasEmpty = await page.getByText(/no.*items|no data/i).isVisible().catch(() => false)
    expect(hasRows || hasEmpty).toBe(true)

    await expect(page.getByText('Error')).not.toBeVisible()
  })
})
