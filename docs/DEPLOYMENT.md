# 배포 가이드

## 배포 환경

| 환경 | URL | 브랜치 |
|------|-----|--------|
| Production | https://2026-claude-hackathon.vercel.app | `main` |
| Preview | Vercel PR Preview URL | PR 브랜치 |

---

## 자동 배포 구조

```
GitHub push (main) → Vercel 자동 빌드 → Production 배포
GitHub PR 생성 → Vercel Preview 빌드 → Preview URL 생성
```

## CI/CD 파이프라인

```
GitHub push/PR → GitHub Actions CI
                  ├── unit-test job (항상 실행)
                  │   └── npm run test (25개 단위 테스트)
                  └── e2e-test job (vars.RUN_E2E == 'true' 시)
                      └── npm run test:e2e (11개 E2E 테스트)
```

**CI 배지:** [![CI](https://github.com/naknakun/2026-claude-hackathon/actions/workflows/ci.yml/badge.svg)](https://github.com/naknakun/2026-claude-hackathon/actions/workflows/ci.yml)

---

## Vercel 초기 설정 (최초 1회)

1. [vercel.com/new](https://vercel.com/new) 접속
2. `naknakun/2026-claude-hackathon` 레포 Import
3. **Root Directory**: `board` 설정 ← 필수
4. 환경 변수 추가:

| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

5. Deploy 클릭

---

## GitHub Actions Secrets 설정 (E2E CI용)

레포 Settings → Secrets and variables → Actions:

| Secret 이름 | 설명 |
|-------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `TEST_EMAIL` | E2E 테스트용 계정 이메일 |
| `TEST_PASSWORD` | E2E 테스트용 계정 비밀번호 |

E2E 테스트 활성화:
- Variables (not Secrets) 탭에서 `RUN_E2E` = `true` 추가

---

## 배포 전 체크리스트

- [ ] `npm run test` 25개 단위 테스트 통과
- [ ] `npm run test:e2e` 11개 E2E 테스트 통과 (dev 서버 실행 중)
- [ ] `npm run build` 빌드 성공
- [ ] `.env.local` 환경 변수 확인 (git에 포함되지 않음)
- [ ] Supabase RLS 정책 활성화 확인

---

## 환경 변수 목록

### 필수 (Vercel + 로컬)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxx...
```

### 로컬 개발 + CI E2E 전용

```
TEST_EMAIL=test@example.com
TEST_PASSWORD=testpassword123
```

---

## Supabase 배포 후 확인

Authentication → URL Configuration:
- **Site URL**: `https://2026-claude-hackathon.vercel.app`
- **Redirect URLs**: `https://2026-claude-hackathon.vercel.app/**`
