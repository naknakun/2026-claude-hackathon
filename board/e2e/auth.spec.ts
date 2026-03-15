import { test, expect } from '@playwright/test'
import { login } from './helpers/auth'

test('로그인 성공 후 홈 리다이렉트 및 로그아웃 버튼 표시', async ({ page }) => {
  await login(page)
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible()
})

test('로그아웃 후 로그인 버튼 표시', async ({ page }) => {
  await login(page)
  await page.getByRole('button', { name: '로그아웃' }).click()
  await expect(page.getByRole('link', { name: '로그인' })).toBeVisible()
})

test('미로그인 상태에서 글쓰기 접근 시 로그인 페이지로 리다이렉트', async ({ page }) => {
  await page.goto('/posts/new')
  await expect(page).toHaveURL('/login')
})
