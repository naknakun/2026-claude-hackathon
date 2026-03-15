import { test, expect } from '@playwright/test'
import { login } from './helpers/auth'

test('댓글 작성 후 목록 표시, 삭제', async ({ page }) => {
  await login(page)

  const title = `댓글 테스트 게시글 ${Date.now()}`

  // 게시글 작성
  await page.getByRole('link', { name: '글쓰기' }).click()
  await page.getByRole('button', { name: '자유' }).click()
  await page.getByPlaceholder('제목').fill(title)
  await page.getByPlaceholder('내용을 입력하세요').fill('댓글 테스트 본문')
  await page.getByRole('button', { name: '등록' }).click()
  await expect(page).toHaveURL('/')

  // 상세 이동
  await page.getByText(title).click()

  // 댓글 작성
  const comment = `테스트 댓글 ${Date.now()}`
  await page.getByPlaceholder('댓글을 입력하세요').fill(comment)
  await page.getByRole('button', { name: '등록' }).last().click()
  await expect(page.getByText(comment)).toBeVisible()

  // 댓글 삭제 (confirm 다이얼로그 수락)
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: '삭제' }).last().click()
  await expect(page.getByText(comment)).not.toBeVisible()

  // 게시글 정리
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: '삭제' }).click()
})
