# ZenBreak - 생산성 도우미 워크북

## 1. API 주소 / 필요한 JSON 키 / 화면 연결 계획
- **농담 API:** `https://official-joke-api.appspot.com/random_joke`
  - **사용 키:** `setup`(농담 질문), `punchline`(농담 답변)
  - **화면 연결:** `setup`은 파란색 배경 카드 상단에, `punchline`은 하단에 표시하여 사용자가 클릭 전 궁금증을 유발함.
- **명언 API:** `https://dummyjson.com/quotes/random`
  - **사용 키:** `quote`(명언 본문), `author`(작성자)
  - **화면 연결:** `quote`는 이탈릭체로 강조하여 노란색 카드 중앙에, `author`는 우측 하단에 표시.

## 2. 실패한 시도 / 오류 기록
- **[오류 1]** 번역 기능 추가 후 한국어 선택 시 로딩 지연 발생. Gemini API 호출이 동기적으로 느껴질 정도로 느림.
- **[오류 3]** Gemini API 429 Resource Exhausted 에러 발생 (할당량 초과).
  - **진행:** 에러 발생 시 앱이 크래시되지 않고 원문(영어)을 반환하여 사용자에게 콘텐츠가 유지되도록 예외 처리 코드를 추가함.

## 3. 오류 해결 / 기능 구현을 위한 프롬프트 기록
- **기능 1 (기본 기능):** "농담 API와 명언 API를 조합하여 로딩/데이터/에러 상태를 모두 갖춘 MVP 화면을 구성해줘."
- **기능 2 (다국어 지원):** "Gemini API를 사용하여 데이터를 가져온 후, 실시간으로 타겟 언어로 번역하는 `geminiService.ts`를 만들고 `App.tsx`에 드롭다운 메뉴를 연동해줘."
- **기능 3 (번역 최적화):** "번역 속도가 너무 느려. 동일한 번역 요청은 캐싱하고, API 호출 시 `temperature`를 낮춰서 응답 속도를 빠르게 해줘."

## 4. 오늘 해결한 것 / 다음에 시도할 것
- **오늘 해결:** 프로젝트 초기 설정, 2개 API 연동, 화면 MVP, 다국어 지원 기능, 번역 캐싱, 및 GitHub 배포 설정 완료.
- **다음 시도:** 농담의 재미 유지를 위해 '농담은 원문 유지, 명언은 번역' 옵션 토글 기능 추가.

## 5. 참고한 API 문서 / 테스트 URL / 캡처 메모
- **농담 API:** https://github.com/15Dkatz/official_joke_api
- **명언 API:** https://dummyjson.com/docs/quotes
- **Gemini API:** SDK docs (시스템 가이드라인 참고)
