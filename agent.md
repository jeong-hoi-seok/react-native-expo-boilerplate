# agent.md

React Native + Expo 보일러플레이트입니다. 답변·작업 보고는 한국어로 작성합니다.

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | Expo `54.0.35` · React Native `0.81.5` |
| UI | React `19.1.0` · `@types/react` `~19.1.10` |
| 언어 | TypeScript (strict) |
| 스타일 | NativeWind · CVA · `cn` (`class-variance-authority` + `tailwind-merge`) |
| 상태 | Zustand |
| 린트/포맷 | Biome |
| 패키지 매니저 | **pnpm** (`npm`/`yarn`/`bun` 사용 안 함) |

- 위 버전은 고정. 의존성 추가·업데이트 시 Expo SDK 54 호환성을 먼저 확인합니다.
- 설치·실행 명령은 `pnpm add`, `pnpm exec` 등 **pnpm만** 사용합니다.
- safe area(`useSafeAreaInsets`, `SafeAreaView`)는 화면 레이아웃 기본 전제.

## 스타일링 — NativeWind 우선

모든 UI 스타일은 **NativeWind `className`**으로 작성합니다. variant가 있는 공용 컴포넌트는 **CVA** + **`cn`**(`@/shared/lib`)을 씁니다. 상세는 `docs/styling.md`를 참고합니다.

| 우선순위 | 방식 | 사용 시점 |
|---|---|---|
| **1** | NativeWind `className` | 레이아웃, 색, 타이포, 간격, 반응형 등 **기본·권장** |
| **1-b** | CVA + `cn` | `ThemedText`처럼 **variant 기반 공용 UI** |
| **2** | `StyleSheet.create` | NativeWind·Tailwind로 표현이 어렵거나 불가능할 때만 |
| **3** | inline `style` | 동적 값(런타임 계산) 등 `className`으로 대체하기 어려울 때만 |

- 새 컴포넌트·화면 작성 시 `style={{ ... }}`·`StyleSheet`부터 시작하지 않습니다.
- Tailwind 진입점: 루트 `styles/global.css`. Metro `input`·`_layout.tsx` import 경로와 일치시킵니다.
- 스타일 관련 공식 문서는 `docs/official-docs-reference.md`의 [NativeWind Installation](https://www.nativewind.dev/docs/getting-started/installation)을 따릅니다.
- 초기 설정·버전 요구사항은 `docs/init-setup.md` 3단계, 패턴·예시는 `docs/styling.md`를 참고합니다.

## 실행·스크립트

| 스크립트 | 실제 명령 | 용도 |
|---|---|---|
| `pnpm start` | `expo start` | 개발 서버 (Metro JS 번들) |
| `pnpm ios` | `expo run:ios` | 로컬 네이티브 빌드 → iOS 설치·실행 |
| `pnpm android` | `expo run:android` | 로컬 네이티브 빌드 → Android 설치·실행 |
| `pnpm lint` | `biome check .` | 린트 |
| `pnpm format` | `biome format --write .` | 포맷 |
| `pnpm typecheck` | `tsc --noEmit` | 타입 검사 |

- `pnpm start`는 JS 번들만 갱신합니다. 네이티브 모듈·`babel`/`metro`/`app.json` 변경 후에는 `pnpm ios` / `pnpm android`로 재빌드합니다.
- 스토어 배포는 EAS Build.

### Git hooks (husky)

`prepare: "husky"`로 clone·install 시 자동 활성화됩니다. **node 22+ 필요** (`nano-staged@1.x`).

| 훅 | 실행 | 동작 |
|---|---|---|
| `pre-commit` | `pnpm exec nano-staged` | 스테이징 파일만 `biome check --write` 자동수정·재-stage, 못 고치는 에러는 커밋 차단 |
| `pre-push` | `pnpm typecheck` | 푸시 전 `tsc --noEmit` |

- nano-staged 글롭은 `package.json`의 `"nano-staged"` 필드. 설정·근거는 `docs/init-setup.md` 5단계.
- 훅이 막더라도 임의로 `--no-verify`로 우회하지 않습니다. 에러를 고치고 다시 커밋·푸시합니다.

## 아키텍처

Feature-Sliced Design. slice 간 결합은 `index.ts` public API로만 합니다.

```txt
src/
  app/        # Expo Router 라우트 (Expo SDK 54+, src/app 자동 인식)
  features/   # 기능 slice (ui / model / api / lib / index.ts)
  entities/   # 도메인 엔티티
  shared/     # 공용 UI·유틸·설정 (ui / lib / config, 세그먼트별 index.ts)
assets/       # 이미지 등 정적 에셋 (루트, @/assets/*)
styles/       # Tailwind 진입점 (global.css)
docs/
```

- **FSD 레이어(`app`·`features`·`entities`·`shared`)는 모두 `src/` 아래**에 둡니다. `features`·`entities`·`shared`를 루트에 두지 않습니다.
- 라우트는 루트 `app/`이 아니라 **`src/app/`** 에 둡니다. [Top-level src directory](https://docs.expo.dev/router/reference/src-directory/)
- `shared`는 세그먼트로 나눕니다 — `shared/ui`(컴포넌트), `shared/lib`(훅·유틸), `shared/config`(상수·테마). 각 세그먼트에 `index.ts` 배럴을 둡니다.
- `tsconfig.json` path alias `@/*`는 `./src/*`를 가리킵니다. 이미지 등 정적 에셋은 루트 `assets/`에 두고 `@/assets/*`(→ `./assets/*`)로 import합니다. (`app.json` 아이콘·스플래시는 `./assets/...` 루트 경로 그대로)

**import 규칙**

- slice 외부 → `src/features/foo/index.ts`, `@/shared/ui` 등 public API만 import
- 같은 계층 slice 내부 파일 직접 import 금지
- 공용 코드는 `src/shared`

**네이밍** — `docs/naming-convention.md`  
**커밋** — `docs/commit-convention.md`  
**MR/PR** — `docs/git-merge-request-guide.md`  
**공식 문서** — `docs/official-docs-reference.md` (RN·Expo·NativeWind API·동작 확인 시 필수)

## docs 확인

작업 시작 전 `docs/` 문서를 먼저 확인합니다. 작업 종류에 맞는 문서만 읽어도 됩니다.

| 문서 | 확인 시점 |
|---|---|
| `docs/official-docs-reference.md` | RN·Expo·NativeWind API, 스타일링, 설정, 빌드·배포 **구현·조사 시** |
| `docs/styling.md` | NativeWind·CVA·`cn` 패턴, 파일 위치, variant 컴포넌트 작성 |
| `docs/init-setup.md` | 프로젝트 **최초 1회** 부트스트랩 (이후 참고 안 함) |
| `docs/naming-convention.md` | 파일·디렉토리·식별자 추가·변경 |
| `docs/commit-convention.md` | 커밋 작성 |
| `docs/git-merge-request-guide.md` | MR/PR 작성 |

- docs와 기존 코드 패턴이 다르면 docs를 우선합니다.

## 작업 원칙

1. 작업 전 관련 코드·docs 확인. RN·Expo API·동작은 `docs/official-docs-reference.md`에 안내된 [React Native Archive](https://archive.reactnative.dev/docs/next/getting-started)·[Expo Docs](https://docs.expo.dev/)를 우선 참고
2. **UI 스타일링은 NativeWind `className` 우선.** variant UI는 CVA + `cn`. Tailwind·설정·트러블슈팅은 [NativeWind Docs](https://www.nativewind.dev/docs/getting-started/installation), `docs/styling.md`, `docs/official-docs-reference.md`를 참고
3. 기존 패턴 유지, 요청 범위만 수정
4. 새 파일·디렉토리는 kebab-case
5. 검증 가능하면 `pnpm lint` / `pnpm typecheck` 실행 후 보고
6. **작업 마무리 시 `agent.md` 갱신 여부를 검증** (아래 기준)

### `agent.md` 마무리 검증

작업 종료 전 `agent.md`와 실제 프로젝트가 일치하는지 확인합니다.

**갱신이 필요한 경우** — `agent.md`를 수정합니다.

| 변경 내용 | 반영 위치 예시 |
|---|---|
| 핀 버전·주요 의존성 변경 | 기술 스택 |
| `package.json` 스크립트 추가·변경 | 실행·스크립트 |
| FSD·import·디렉토리 규칙 변경 | 아키텍처 |
| 패키지 매니저·빌드·실행 방식 변경 | 기술 스택·실행·스크립트 |
| AI가 매번 알아야 할 새 전역 규칙 | 해당 섹션 또는 작업 원칙 |

**갱신하지 않는 경우** — `docs/`에 기록합니다.

- 기능별 구현 상세·시행착오
- 일회성 설정·실험 기록
- `init-setup.md` 범위의 최초 설치 절차 (이미 완료된 경우)

작업 보고에 `agent.md` **갱신함 / 갱신 불필요** 중 하나를 명시합니다. 갱신했으면 변경 요약을 함께 적습니다.
