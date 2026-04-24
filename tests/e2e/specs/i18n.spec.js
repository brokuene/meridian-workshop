import { test, expect } from '@playwright/test'

// Helper: click the language button then pick a locale option
async function selectLanguage(page, targetLocale) {
  // The button label is either "English" or "日本語"
  await page.locator('.language-button').click()
  // Options in dropdown are buttons with class dropdown-item
  const option = page.locator('.dropdown-item').filter({ hasText: targetLocale })
  await option.waitFor({ timeout: 5_000 })
  await option.click()
  await page.waitForTimeout(400)
}

test.describe('i18n language toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=Inventory Turnover Rate')
  })

  test('default language is English', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Overview' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Inventory' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible()
    await expect(page.locator('.language-button')).toContainText('English')
  })

  test('switching to Japanese changes nav labels', async ({ page }) => {
    await selectLanguage(page, '日本語')

    // Nav should now show Japanese labels
    await expect(page.getByRole('link', { name: '概要' })).toBeVisible()
    await expect(page.getByRole('link', { name: '在庫' })).toBeVisible()
    await expect(page.getByRole('link', { name: '注文' })).toBeVisible()
  })

  test('Japanese mode shows Japanese page heading on dashboard', async ({ page }) => {
    await selectLanguage(page, '日本語')
    await expect(page.getByRole('heading', { name: '概要', level: 2 })).toBeVisible()
  })

  test('switching to Japanese updates filter labels', async ({ page }) => {
    await selectLanguage(page, '日本語')
    await expect(page.getByText('期間')).toBeVisible()   // Time Period
    await expect(page.getByText('場所')).toBeVisible()   // Location
  })

  test('switching back to English restores English labels', async ({ page }) => {
    await selectLanguage(page, '日本語')
    await expect(page.getByRole('link', { name: '概要' })).toBeVisible()

    // Switch back to English
    await selectLanguage(page, 'English')
    await expect(page.getByRole('link', { name: 'Overview' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Inventory' })).toBeVisible()
  })

  test('Japanese restocking page shows translated heading', async ({ page }) => {
    await selectLanguage(page, '日本語')
    await page.getByRole('link', { name: '補充推奨' }).click()
    await page.waitForTimeout(500)
    await expect(page.getByRole('heading', { name: '補充推奨' })).toBeVisible()
  })
})
