# React Native Expo Boilerplate

React Native + Expo로 앱을 시작할 때 쓰는 보일러플레이트입니다.

## 기술 스택

- Expo `54.0.35` · React Native `0.81.5` · React `19.1.0`
- TypeScript · NativeWind · Zustand · Biome

## 구조

```txt
app/
features/
entities/
shared/
assets/
docs/
wiki/
```

FSD 스타일로 기능을 나누고, 파일명은 kebab-case를 씁니다. 자세한 규칙은 `docs/naming-convention.md`를 보세요.

## 시작하기

```sh
pnpm install
pnpm expo start
```

네이티브 빌드:

```sh
pnpm ios
pnpm android
```

## 문서

- `agent.md` — AI 작업 지침
- `docs/naming-convention.md` — 네이밍
- `docs/commit-convention.md` — 커밋
- `docs/ai-wiki-guide.md` — wiki 작성 가이드
- `wiki/` — 프로젝트 지식 기록
