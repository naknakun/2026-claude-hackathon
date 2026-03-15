import { test, expect } from '@playwright/test'
import { login } from './helpers/auth'

test('키워드 검색 후 해당 게시글 표시', async ({ page }) => {
  await login(page)

  const keyword = `searchtest${Date.now()}`
  const title = `${keyword} 게시글`

  // 게시글 작성
  await page.getByRole('link', { name: '글쓰기' }).click()
  await page.getByRole('button', { name: '자유' }).click()
  await page.getByPlaceholder('제목').fill(title)
  await page.getByPlaceholder('내용을 입력하세요').fill('검색 테스트 본문')
  await page.getByRole('button', { name: '등록' }).click()
  await expect(page).toHaveURL('/')

  // 검색 (pressSequentially로 React state 동기화 보장)
  await page.getByPlaceholder('제목 또는 내용 검색').pressSequentially(keyword)
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')
  await expect(page.getByText(title)).toBeVisible()

  // 정리
  await page.getByText(title).click()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: '삭제' }).click()
})

test('존재하지 않는 키워드 검색 시 빈 결과 메시지', async ({ page }) => {
  await page.goto('/?search=존재하지않는키워드xyz987')
  await expect(page.getByText('검색 결과가 없습니다')).toBeVisible()
})

test('검색어 초기화 후 전체 목록 복원', async ({ page }) => {
  await page.goto('/?search=테스트')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: '검색어 초기화' }).click()
  await expect(page).toHaveURL('/')
})
