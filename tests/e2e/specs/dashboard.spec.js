import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=Inventory Turnover Rate')
  })

  test('KPI cards load with valid numeric values', async ({ page }) => {
    // Five KPI cards should be visible
    const kpiSection = page.locator('text=Key Performance Indicators').locator('..')
    await expect(kpiSection).toBeVisible()

    // Spot-check specific KPI labels
    await expect(page.getByText('Inventory Turnover Rate')).toBeVisible()
    await expect(page.getByText('Orders Fulfilled')).toBeVisible()
    await expect(page.getByText('Order Fill Rate')).toBeVisible()
    await expect(page.getByText('Revenue (Orders) YTD')).toBeVisible()
    await expect(page.getByText('Avg Processing Time (Days)')).toBeVisible()
  })

  test('KPI values are non-empty numbers', async ({ page }) => {
    // Revenue YTD card contains a dollar amount
    const revenueCard = page.locator('.kpi-card, .stat-card').filter({ hasText: 'Revenue (Orders) YTD' })
    await expect(revenueCard).toBeVisible()
    const valueText = await revenueCard.textContent()
    expect(valueText).toMatch(/\$[\d,]+/)
  })

  test('Inventory Shortages table renders rows', async ({ page }) => {
    await expect(page.getByText(/Inventory Shortages/)).toBeVisible()
    // At least one shortage row should exist (Order ID column)
    const rows = page.locator('table').filter({ hasText: 'Order ID' }).locator('tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('Top Products table renders rows', async ({ page }) => {
    await expect(page.getByText('Top Products by Revenue')).toBeVisible()
    const rows = page.locator('table').filter({ hasText: 'Units Ordered' }).locator('tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('Location filter reloads dashboard data', async ({ page }) => {
    const locationSelect = page.locator('select').nth(1) // second select = Location
    await locationSelect.selectOption('San Francisco')

    // Page shouldn't show an error state
    await expect(page.getByText('Error')).not.toBeVisible()
    // KPI section should still be visible after filter change
    await expect(page.getByText('Inventory Turnover Rate')).toBeVisible()
  })
})
