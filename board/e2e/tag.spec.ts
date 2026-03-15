import { test, expect } from '@playwright/test'
import { login } from './helpers/auth'

test('태그 작성 후 목록에 뱃지 표시 및 태그 필터', async ({ page }) => {
  await login(page)

  const tag = `e2etag${Date.now()}`
  const title = `태그 테스트 게시글 ${Date.now()}`

  // 태그 포함 게시글 작성
  await page.getByRole('link', { name: '글쓰기' }).click()
  await page.getByRole('button', { name: '자유' }).click()
  await page.getByPlaceholder('제목').fill(title)
  await page.getByPlaceholder('내용을 입력하세요').fill('태그 테스트 본문')
  await page.getByPlaceholder('태그 입력 후 Enter (예: React, Next.js)').fill(tag)
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: '등록' }).click()
  await expect(page).toHaveURL('/')

  // 목록에서 태그 뱃지 확인
  await expect(page.getByText(`#${tag}`).first()).toBeVisible()

  // 상세에서 태그 클릭 → 필터
  await page.getByText(title).click()
  await page.waitForLoadState('networkidle')

  // TagBadge 버튼 클릭
  const tagBadge = page.locator('button').filter({ hasText: `#${tag}` })
  await tagBadge.click()
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveURL(new RegExp(`tag=${tag}`))
  await expect(page.getByText(title)).toBeVisible()

  // 정리
  await page.getByText(title).click()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: '삭제' }).click()
})
