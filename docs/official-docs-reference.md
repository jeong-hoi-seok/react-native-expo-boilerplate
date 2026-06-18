# 공식 문서 참조 가이드

React Native·Expo 작업 시 **공식 문서를 우선** 확인합니다. 이 저장소의 `docs/`는 프로젝트 규칙이고, API·동작·플랫폼 제약은 아래 공식 문서가 기준입니다.

## 공식 문서

| 구분 | URL | 용도 |
|---|---|---|
| **React Native** | [archive.reactnative.dev/docs/next/getting-started](https://archive.reactnative.dev/docs/next/getting-started) | 코어 컴포넌트, 스타일, 네트워킹, 네이티브 연동 등 RN 기본 |
| **Expo** | [docs.expo.dev](https://docs.expo.dev/) | Expo SDK, Router, EAS, config plugin, 개발·배포 워크플로 |
| **NativeWind** | [nativewind.dev/docs/getting-started/installation](https://www.nativewind.dev/docs/getting-started/installation) | `className` 스타일링, Tailwind 설정, Metro·Babel 연동 |
| **CVA** | [cva.style](https://cva.style/docs) | variant 기반 className (`class-variance-authority`) |

- React Native 문서는 **위 Archive 사이트**에서 찾습니다. (`next` 문서 트리 기준)
- Expo 프로젝트이므로 Expo 문서를 먼저 보고, RN 코어가 필요할 때 React Native 문서로 넘어갑니다.
- **UI 스타일링**은 [NativeWind Docs](https://www.nativewind.dev/docs/getting-started/installation)를 우선합니다. variant 공용 컴포넌트는 [CVA](https://cva.style/docs) + 프로젝트 `docs/styling.md`를 따릅니다. RN `Style` API는 NativeWind로 표현이 어려울 때만 보조로 봅니다.

## 언제 무엇을 볼까

| 작업 | 먼저 볼 문서 | 예시 |
|---|---|---|
| Expo SDK 모듈·설정 | [Expo Docs](https://docs.expo.dev/) | `expo-camera`, `app.json`, EAS Build |
| 라우팅·레이아웃 | [Expo Router](https://docs.expo.dev/router/introduction/) | `src/app/` 파일 기반 라우트, 탭·스택 |
| UI 스타일링 (`className`) | [NativeWind Docs](https://www.nativewind.dev/docs/getting-started/installation) · `docs/styling.md` | Tailwind 유틸, CVA·`cn`, 다크 모드, `remapProps` |
| 레이아웃·컴포넌트 (RN 코어) | [React Native Docs](https://archive.reactnative.dev/docs/next/getting-started) | `View`, `Text`, Flexbox, `FlatList` |
| 네이티브 빌드·모듈 | Expo + RN 양쪽 | config plugin → Expo, 네이티브 API → RN |
| 의존성·SDK 업그레이드 | [Expo SDK](https://docs.expo.dev/versions/latest/) | SDK 54 호환 패키지 버전 |

## 작업 순서 (권장)

1. 이 저장소 `agent.md` · 관련 `docs/` 확인
2. **Expo Docs**에서 SDK·도구·배포 관련 내용 검색
3. 스타일·레이아웃 작업은 **NativeWind Docs**와 **`docs/styling.md`**에서 `className`·CVA·Tailwind 패턴 확인
4. RN 코어 API·컴포넌트가 필요하면 **React Native Archive Docs**에서 확인
5. 공식 문서와 프로젝트 규칙이 충돌하면 — 구현·버전은 공식 문서, 네이밍·구조·커밋·스타일 우선순위 등은 이 저장소 `docs/`·`agent.md` 우선

## 자주 쓰는 링크

### Expo

- [시작하기](https://docs.expo.dev/get-started/introduction/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Top-level src directory](https://docs.expo.dev/router/reference/src-directory/) (`src/app`, SDK 54+)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Config Plugins](https://docs.expo.dev/config-plugins/introduction/)
- [SDK 레퍼런스](https://docs.expo.dev/versions/latest/)

### NativeWind

- [Installation (Expo)](https://www.nativewind.dev/docs/getting-started/installation)
- [v4 Announcement (CVA·clsx 호환)](https://www.nativewind.dev/blog/announcement-nativewind-v4)
- [Troubleshooting](https://www.nativewind.dev/docs/getting-started/troubleshooting)
- [Dark Mode](https://www.nativewind.dev/docs/core-concepts/dark-mode)
- [Safe Area Insets](https://www.nativewind.dev/docs/react-native-concepts/safe-area-insets)
- [Configuration](https://www.nativewind.dev/docs/customization/configuration)
- [Third-party components](https://www.nativewind.dev/docs/guides/third-party-components)

### CVA · 클래스 유틸

- [CVA — Variants](https://cva.style/docs/getting-started/variants)
- [CVA + Tailwind CSS](https://cva.style/docs/guides/tailwind-css)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)

### React Native (Archive)

- [시작하기](https://archive.reactnative.dev/docs/next/getting-started)
- [Core Components](https://archive.reactnative.dev/docs/next/components-and-apis)
- [Style](https://archive.reactnative.dev/docs/next/style)
- [Flexbox](https://archive.reactnative.dev/docs/next/flexbox)
- [TypeScript](https://archive.reactnative.dev/docs/next/typescript)
- [Troubleshooting](https://archive.reactnative.dev/docs/next/troubleshooting)

## AI·에이전트 메모

- 답변·구현 전에 위 공식 문서 내용과 **현재 프로젝트 핀 버전**(Expo SDK 54, RN 0.81, NativeWind `^4.2.1`)이 맞는지 확인합니다.
- 링크 인용 시 React Native는 `archive.reactnative.dev/docs/next/...` 경로를 사용합니다.
- 스타일 구현 시 `StyleSheet`·inline `style` 대신 **NativeWind `className`**을 기본으로 제안합니다. variant 공용 UI는 **CVA + `cn`**(`docs/styling.md`)을 따릅니다.
- 불확실한 API 동작은 추측하지 말고 공식 문서를 기준으로 합니다.
