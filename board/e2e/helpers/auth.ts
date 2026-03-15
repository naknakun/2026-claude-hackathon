import { Page } from '@playwright/test'

export async function login(page: Page) {
  const email = process.env.TEST_EMAIL!
  const password = process.env.TEST_PASSWORD!

  await page.goto('/login')
  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: '로그인' }).click()
  await page.waitForURL('/')
}
