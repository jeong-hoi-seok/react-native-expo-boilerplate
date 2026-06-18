# 초기 설치 가이드

> **이 문서는 프로젝트 최초 부트스트랩(1회)에만 사용합니다.**  
> 이후 의존성 추가·기능 설정은 `agent.md`·`wiki/`를 따릅니다.

React Native + Expo + NativeWind + Biome으로 이 보일러플레이트를 부트스트랩합니다.

**`App.js`를 직접 만들지 않습니다.** [`create-expo-app`](https://docs.expo.dev/more/create-expo/)이 `app/`, `assets/`, `app.json`을 생성합니다.

저장소를 clone한 뒤 **프로젝트 루트**에서 진행합니다. `docs/`, `.vscode/`, `agent.md`는 그대로 두고 앱 코드만 얹습니다.

## 패키지 매니저 — pnpm

이 보일러플레이트는 **의존성 설치·실행에 pnpm만 사용**합니다. (`npm`, `yarn`, `bun` 사용하지 않음)

| 근거 | 내용 |
|---|---|
| Expo 공식 | [`create-expo-app`](https://docs.expo.dev/more/create-expo/)이 `pnpm-lock.yaml` 존재 시 pnpm을 자동 인식. `expo install`도 `--pnpm` 지원 |
| SDK 54 | pnpm isolated 설치 공식 지원. 일부 RN 네이티브 모듈 이슈 시 hoisted로 전환 가능 |
| 이 저장소 | `.gitignore`에 `.pnpm-store/` 반영, 문서·스크립트 전부 `pnpm` 기준 |

pnpm으로 `create-expo-app`을 실행하면 `.npmrc`에 `node-linker=hoisted`가 잡히는 경우가 많습니다. 없으면 루트에 추가합니다. SDK 54에서 isolated로 운영해도 되지만, 네이티브 빌드·autolinking 오류가 나면 hoisted를 유지하세요.

```ini
# .npmrc
node-linker=hoisted
```

설치 명령은 문서 전체에서 `pnpm add`, `pnpm create`, `pnpm exec`만 사용합니다.

> Zustand 등 추가 라이브러리는 `agent.md`·`wiki/`를 참고하세요.

## 사전 요구사항

| 도구 | 용도 |
|---|---|
| [Node.js](https://nodejs.org/) LTS | 런타임 |
| [pnpm](https://pnpm.io/installation) | 패키지 매니저 (**필수**) |
| Xcode (macOS) | iOS 빌드 |
| Android Studio | Android 빌드 |

## 1단계: create-expo-app + 버전 고정

```sh
pnpm create expo-app@latest . --template default --yes
```

`default`는 Expo Router + TypeScript + `expo-router/entry` 진입점입니다. 다른 템플릿(`tabs`, `blank-typescript`)도 가능합니다.

핀 버전:

| 패키지 | 버전 |
|---|---|
| `expo` | `54.0.35` |
| `react-native` | `0.81.5` |
| `react` | `19.1.0` |
| `@types/react` | `~19.1.10` |

```sh
pnpm add expo@54.0.35 react@19.1.0 react-native@0.81.5
pnpm add -D @types/react@~19.1.10
```

## 2단계: FSD 폴더

```sh
mkdir -p features entities shared wiki
```

구조·import 규칙은 `agent.md`를 따릅니다.

## 3단계: NativeWind

스타일은 **NativeWind `className`** 1순위 (`agent.md`).

> Expo SDK 54는 Reanimated v4를 씁니다. **NativeWind `4.2.1` 이상**이 필요합니다.

### 설치

```sh
pnpm add nativewind@^4.2.1 react-native-reanimated react-native-safe-area-context
pnpm add -D tailwindcss@^3.4.17
pnpm exec tailwindcss init
```

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./entities/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
```

루트 `global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### babel.config.js

```js
module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
```

`react-native-worklets/plugin`은 추가하지 않습니다. Reanimated v4에 포함되어 중복 오류가 납니다.

### metro.config.js

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### 연결

`app/_layout.tsx` 최상단:

```tsx
import "../global.css";
```

루트 `nativewind-env.d.ts` (`nativewind.d.ts`, `app.d.ts` 이름 금지):

```ts
/// <reference types="nativewind/types" />
```

`className` 적용을 확인한 뒤 캐시를 지우고 실행합니다.

```sh
pnpm exec expo start -c
```

`babel.config.js`·`metro.config.js` 변경 후에는 `pnpm ios` / `pnpm android`로 네이티브 재빌드가 필요할 수 있습니다.

## 4단계: Biome

```sh
pnpm add -D @biomejs/biome
pnpm exec biome init
```

`biome init` 결과를 베이스로 아래만 맞춥니다.

- `formatter.lineWidth`: `100`
- `files.includes`: `!.pnpm-store`, `!.expo`, `!dist`, `!web-build` 제외
- `javascript.formatter`: `quoteStyle` `double`, `semicolons` `always`, `trailingCommas` `all`

`package.json`에 스크립트 추가·교체:

```json
{
  "lint": "biome check .",
  "format": "biome format --write .",
  "typecheck": "tsc --noEmit"
}
```

템플릿에 ESLint가 있으면 제거합니다.

```sh
pnpm remove eslint eslint-config-expo
rm -f eslint.config.js .eslintrc.js .eslintrc.json
```

에디터는 저장소의 `.vscode/settings.json`(Biome + Tailwind IntelliSense)을 그대로 사용합니다.

## 5단계: 검증

```sh
pnpm lint
pnpm typecheck
pnpm start
```

네이티브 빌드가 필요할 때:

```sh
pnpm ios
pnpm android
```
