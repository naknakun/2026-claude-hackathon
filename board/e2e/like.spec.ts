import { test, expect } from '@playwright/test'
import { login } from './helpers/auth'

test('좋아요 클릭 시 수 증가, 재클릭 시 감소', async ({ page }) => {
  await login(page)

  const title = `좋아요 테스트 게시글 ${Date.now()}`

  // 게시글 작성
  await page.getByRole('link', { name: '글쓰기' }).click()
  await page.getByRole('button', { name: '자유' }).click()
  await page.getByPlaceholder('제목').fill(title)
  await page.getByPlaceholder('내용을 입력하세요').fill('좋아요 테스트 본문')
  await page.getByRole('button', { name: '등록' }).click()
  await expect(page).toHaveURL('/')

  // 상세 이동
  await page.getByText(title).click()

  // 좋아요 버튼 찾기 (♡/♥ + 숫자 구조)
  const likeButton = page.locator('button').filter({ hasText: /[♥♡]/ })
  await expect(likeButton).toBeVisible()

  const countSpan = likeButton.locator('span').last()
  const initialCount = parseInt(await countSpan.textContent() ?? '0')

  // 좋아요 클릭 → +1
  await likeButton.click()
  await expect(countSpan).toHaveText(String(initialCount + 1))

  // 다시 클릭 → -1 (취소)
  await likeButton.click()
  await expect(countSpan).toHaveText(String(initialCount))

  // 게시글 정리
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: '삭제' }).click()
})
