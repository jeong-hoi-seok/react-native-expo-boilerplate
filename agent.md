# agent.md

React Native + Expo 보일러플레이트입니다. 답변·작업 보고는 한국어로 작성합니다.

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | Expo `54.0.35` · React Native `0.81.5` |
| UI | React `19.1.0` · `@types/react` `~19.1.10` |
| 언어 | TypeScript (strict) |
| 스타일 | NativeWind (1순위) |
| 상태 | Zustand |
| 린트/포맷 | Biome |

- 위 버전은 고정. 의존성 추가·업데이트 시 Expo SDK 54 호환성을 먼저 확인합니다.
- 스타일은 `className` 우선. `StyleSheet`·inline style은 예외적 사용.
- safe area(`useSafeAreaInsets`, `SafeAreaView`)는 화면 레이아웃 기본 전제.

## 아키텍처

Feature-Sliced Design. slice 간 결합은 `index.ts` public API로만 합니다.

```txt
app/          # Expo Router 라우트
features/     # 기능 slice (ui / model / api / lib / index.ts)
entities/     # 도메인 엔티티
shared/       # 공용 UI·유틸·타입
assets/
docs/
wiki/         # AI·팀 지식 기록
```

**import 규칙**

- slice 외부 → `features/foo/index.ts` 등 public API만 import
- 같은 계층 slice 내부 파일 직접 import 금지
- 공용 코드는 `shared`, 재사용 지식은 `wiki`

**네이밍** — `docs/naming-convention.md`  
**커밋** — `docs/commit-convention.md`  
**wiki** — `docs/ai-wiki-guide.md`

## 작업 원칙

1. 작업 전 관련 코드·docs·`wiki/index.md` 확인
2. 기존 패턴 유지, 요청 범위만 수정
3. 새 파일·디렉토리는 kebab-case
4. 검증 가능하면 lint / typecheck 실행 후 보고
