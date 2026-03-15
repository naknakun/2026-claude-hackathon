/**
 * 쉼표로 구분된 태그 문자열을 배열로 변환
 * @example parseTags("React, Next.js") => ["React", "Next.js"]
 */
export function parseTags(input: string): string[] {
  if (!input.trim()) return []
  return input
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
}

/**
 * 태그 배열을 쉼표 구분 문자열로 변환 (입력창 초기값용)
 */
export function formatTags(tags: string[]): string {
  return tags.join(', ')
}
