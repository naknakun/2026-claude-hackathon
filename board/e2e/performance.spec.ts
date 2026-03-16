import { test, expect } from '@playwright/test'

test('홈 페이지 초기 로드 3초 이내', async ({ page }) => {
  const start = Date.now()
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
  const duration = Date.now() - start

  console.log(`홈 페이지 로드: ${duration}ms`)
  expect(duration).toBeLessThan(3000)
})

test('로그인 페이지 로드 2초 이내', async ({ page }) => {
  const start = Date.now()
  await page.goto('/login')
  await page.waitForLoadState('domcontentloaded')
  const duration = Date.now() - start

  console.log(`로그인 페이지 로드: ${duration}ms`)
  expect(duration).toBeLessThan(2000)
})

test('게시글 상세 페이지 응답 확인', async ({ page }) => {
  // 홈에서 첫 번째 게시글 링크 찾기
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')

  const firstPost = page.locator('a[href^="/posts/"]').first()
  const count = await firstPost.count()

  if (count > 0) {
    const start = Date.now()
    await firstPost.click()
    await page.waitForLoadState('domcontentloaded')
    const duration = Date.now() - start

    console.log(`게시글 상세 로드: ${duration}ms`)
    expect(duration).toBeLessThan(3000)
  } else {
    // 게시글 없으면 skip
    console.log('게시글 없음 — 성능 테스트 skip')
  }
})
