# Kiko - 일본어 학습 플랫폼

## 프로젝트 개요
유튜브 영상 기반 일본어 학습 MVP. 자막 동기화 + LLM 번역 검증.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (Hand-Drawn 디자인 시스템)
- Vitest + Playwright
- pnpm

## 주요 명령어
- `pnpm dev` - 개발 서버
- `pnpm build` - 프로덕션 빌드
- `pnpm test` - Vitest 테스트
- `pnpm test:e2e` - Playwright E2E 테스트

## API 키
- YouTube Data API v3: `.env.local` → `YOUTUBE_API_KEY`
- OpenAI: `.env.local` → `OPENAI_API_KEY`

## 디자인 시스템
- `.claude/STYLE.md` 참조
- Hand-Drawn 스타일: wobbly borders, hard offset shadows, 수기체 폰트
- 색상: #fdfbf7 (배경), #2d2d2d (전경), #ff4d4d (강조), #2d5da1 (보조)

## 아키텍처
- LLM: 전략 패턴 (`LLMProvider` 인터페이스 → OpenAI 구현체)
- YouTube: Data API v3 + 자막 추출
- 자막 동기화: YouTube IFrame API onStateChange + 타임스탬프 매칭

## 작업 규칙
1. TDD: 테스트 먼저 → 구현 → 리팩토링
2. 모든 테스트 통과 전 다음 태스크 진행 금지
3. 각 태스크 완료 시 CLAUDE.md 업데이트
4. 커버리지 80% 이상 유지

## 진행 상황
- [x] Phase 0: 프로젝트 초기화
- [x] Phase 1: YouTube URL 파싱
- [x] Phase 2: YouTube API 연동
- [x] Phase 3: 일본어 감지
- [x] Phase 4: 영상 플레이어 & 자막 동기화
- [x] Phase 5: LLM 번역 검증
- [x] Phase 6: 통합 & E2E

## 테스트 현황
- 단위 테스트: 8개 파일, 47 테스트
- 통합 테스트: 2개 파일, 5 테스트
- E2E 테스트: 1개 파일, 4 테스트
- 총 56 테스트 전체 통과
