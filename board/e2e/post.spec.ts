import { test, expect } from '@playwright/test'
import { login } from './helpers/auth'

const TITLE = `E2E 테스트 게시글 ${Date.now()}`

test('글 작성 후 목록에 표시', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: '글쓰기' }).click()
  await expect(page).toHaveURL('/posts/new')

  await page.getByRole('button', { name: '건의' }).click()
  await page.getByPlaceholder('제목').fill(TITLE)
  await page.getByPlaceholder('내용을 입력하세요').fill('E2E 테스트 본문입니다.')
  await page.getByRole('button', { name: '등록' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByText(TITLE)).toBeVisible()
})

test('글 상세 확인 후 삭제', async ({ page }) => {
  await login(page)

  const title = `삭제용 게시글 ${Date.now()}`
  await page.getByRole('link', { name: '글쓰기' }).click()
  await page.getByRole('button', { name: '자유' }).click()
  await page.getByPlaceholder('제목').fill(title)
  await page.getByPlaceholder('내용을 입력하세요').fill('삭제 테스트 본문')
  await page.getByRole('button', { name: '등록' }).click()
  await expect(page).toHaveURL('/')

  await page.getByText(title).click()
  await expect(page.getByRole('heading', { name: title })).toBeVisible()

  // confirm 다이얼로그 수락
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: '삭제' }).click()
  await page.waitForURL('/')
  await expect(page.getByText(title)).not.toBeVisible()
})
