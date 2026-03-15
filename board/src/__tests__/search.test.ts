import { describe, it, expect } from 'vitest'
import { parseTags, formatTags } from '@/lib/search'

describe('parseTags', () => {
  it('쉼표로 구분된 태그를 배열로 변환', () => {
    expect(parseTags('React, Next.js, TypeScript')).toEqual(['React', 'Next.js', 'TypeScript'])
  })

  it('앞뒤 공백 제거', () => {
    expect(parseTags('  태그1 ,  태그2  ')).toEqual(['태그1', '태그2'])
  })

  it('빈 문자열은 빈 배열 반환', () => {
    expect(parseTags('')).toEqual([])
  })

  it('공백만 있는 문자열은 빈 배열 반환', () => {
    expect(parseTags('   ')).toEqual([])
  })

  it('쉼표 사이 빈 항목 제거', () => {
    expect(parseTags('태그1,,태그2')).toEqual(['태그1', '태그2'])
  })

  it('태그 1개', () => {
    expect(parseTags('React')).toEqual(['React'])
  })
})

describe('formatTags', () => {
  it('태그 배열을 쉼표 구분 문자열로 변환', () => {
    expect(formatTags(['React', 'Next.js'])).toBe('React, Next.js')
  })

  it('빈 배열은 빈 문자열 반환', () => {
    expect(formatTags([])).toBe('')
  })

  it('태그 1개', () => {
    expect(formatTags(['React'])).toBe('React')
  })
})
