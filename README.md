# React Native Expo Boilerplate

React Native + Expo로 앱을 시작할 때 쓰는 보일러플레이트입니다.

## 기술 스택

- Expo `54.0.35` · React Native `0.81.5` · React `19.1.0`
- TypeScript · NativeWind · Zustand · Biome

## 구조

```txt
src/
  app/        # Expo Router 라우트 (SDK 54에서 src/app 자동 인식)
  features/   # 기능 slice
  entities/   # 도메인 엔티티
  shared/     # 공용 UI·유틸·설정 (ui / lib / config)
assets/       # 이미지 등 정적 에셋 (루트, @/assets/*)
docs/
wiki/         # 프로젝트 지식 기록 (FSD 아님, 루트 유지)
```

FSD 레이어(`app`·`features`·`entities`·`shared`)는 **모두 `src/` 아래**에 둡니다. 파일명은 kebab-case를 씁니다. 자세한 규칙은 `docs/naming-convention.md`를 보세요.

## 시작하기

처음 세팅은 [`docs/init-setup.md`](docs/init-setup.md)를 따릅니다.

## 실행·빌드

Expo 앱은 크게 **두 가지**로 돌립니다.

| 방식 | 하는 일 | 스크립트 | 실제 명령 |
|---|---|---|---|
| **개발 서버** | Metro가 JS 번들만 제공. 시뮬레이터·실기기 앱(Expo Go 등)이 번들을 받아 실행 | `pnpm start` | `expo start` |
| **로컬 네이티브 빌드** | 네이티브 프로젝트를 컴파일해 시뮬레이터·실기기에 **앱을 설치**한 뒤 실행 | `pnpm ios` / `pnpm android` | `expo run:ios` / `expo run:android` |

개발 서버 — UI·로직 수정, 빠른 반복:

```sh
pnpm install
pnpm start
```

로컬 네이티브 빌드 — 최초 실행, 네이티브 모듈·`babel`/`metro`/`app.json` 변경 후:

```sh
pnpm ios      # expo run:ios
pnpm android  # expo run:android
```

`pnpm start`만으로는 네이티브 코드가 반영되지 않습니다. 네이티브 쪽을 건드렸다면 `pnpm ios` / `pnpm android`로 다시 빌드하세요.

### 기타 스크립트

| 스크립트 | 실제 명령 | 용도 |
|---|---|---|
| `pnpm lint` | `biome check .` | 린트 |
| `pnpm format` | `biome format --write .` | 포맷 |
| `pnpm typecheck` | `tsc --noEmit` | 타입 검사 |

### Git hooks

husky로 자동 실행됩니다 (clone·`pnpm install` 시 `prepare`로 활성화, **node 22+ 필요**).

- **pre-commit** — `nano-staged`가 스테이징 파일만 Biome 자동수정·재-stage
- **pre-push** — `pnpm typecheck`

스토어 배포용 빌드는 [EAS Build](https://docs.expo.dev/build/introduction/)를 씁니다. 상세는 `wiki/`에 정리합니다.

## 문서

- `agent.md` — AI 작업 지침
- `docs/init-setup.md` — 초기 설치 (Expo + NativeWind + Biome)
- `docs/naming-convention.md` — 네이밍
- `docs/commit-convention.md` — 커밋
- `docs/ai-wiki-guide.md` — wiki 작성 가이드
- `wiki/` — 프로젝트 지식 기록
