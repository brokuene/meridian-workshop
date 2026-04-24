import { test, expect } from '@playwright/test'

test.describe('Restocking Recommendations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForSelector('h2', { timeout: 10_000 })
    // Wait for either table rows or the empty state message
    await page.locator('table tbody tr, .empty-state').first().waitFor({ timeout: 15_000 })
  })

  test('page renders title and budget controls', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible()
    await expect(page.getByText('Budget ceiling (optional)')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Get Recommendations' })).toBeVisible()
  })

  test('loads recommendations on mount', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('total cost chip shows a dollar amount', async ({ page }) => {
    const chip = page.locator('.summary-chip.total')
    await expect(chip).toBeVisible()
    const text = await chip.textContent()
    expect(text).toMatch(/\$[\d,]+/)
  })

  test('budget ceiling limits recommendations and shows remaining', async ({ page }) => {
    const allRows = page.locator('table tbody tr')
    const totalBefore = await allRows.count()

    // Enter a small budget to constrain results
    const budgetInput = page.locator('input[type=number]')
    await budgetInput.fill('20000')
    await page.getByRole('button', { name: 'Get Recommendations' }).click()
    await page.waitForTimeout(800)

    const rowsAfter = await allRows.count()
    expect(rowsAfter).toBeLessThanOrEqual(totalBefore)

    // Budget remaining chip should appear
    await expect(page.getByText('Budget remaining')).toBeVisible()
    const remainingChip = page.getByText('Budget remaining').locator('..')
    const remainText = await remainingChip.textContent()
    expect(remainText).toMatch(/\$/)
  })

  test('zero budget shows empty state or single item', async ({ page }) => {
    const budgetInput = page.locator('input[type=number]')
    await budgetInput.fill('1')
    await page.getByRole('button', { name: 'Get Recommendations' }).click()
    await page.waitForTimeout(800)

    await expect(page.getByText('Error')).not.toBeVisible()
    // Either no rows or very few rows
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    expect(count).toBeLessThanOrEqual(1)
  })

  test('warehouse filter reloads recommendations', async ({ page }) => {
    const locationSelect = page.locator('select').nth(1)
    await locationSelect.selectOption('London')
    await page.waitForTimeout(800)

    await expect(page.getByText('Error')).not.toBeVisible()
    // If rows exist, they should all be from London
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      const warehouseCells = page.locator('table tbody tr td:nth-child(4)')
      const texts = await warehouseCells.allTextContents()
      for (const t of texts) {
        expect(t).toBe('London')
      }
    }
  })

  test('priority badges render with expected values', async ({ page }) => {
    const badges = page.locator('.badge[class*="priority-"]')
    const count = await badges.count()
    if (count > 0) {
      const validPriorities = ['Critical', 'High', 'Medium', 'Low']
      for (let i = 0; i < count; i++) {
        const text = await badges.nth(i).textContent()
        expect(validPriorities).toContain(text?.trim())
      }
    }
  })
})
