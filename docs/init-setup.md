# 초기 설치 가이드

> **이 문서는 프로젝트 최초 부트스트랩(1회)에만 사용합니다.**  
> 이후 의존성 추가·기능 설정은 `agent.md`·`wiki/`를 따릅니다.

React Native + Expo + NativeWind + Biome으로 이 보일러플레이트를 부트스트랩합니다.

**`App.js`를 직접 만들지 않습니다.** [`create-expo-app`](https://docs.expo.dev/more/create-expo/)이 `app/`, `assets/`, `app.json`을 생성합니다.

이 보일러플레이트는 라우트를 **`src/app/`** 에 둡니다. 템플릿이 루트 `app/`을 만들면 1단계 직후 `src/app/`으로 옮깁니다. [Expo Router — Top-level src directory](https://docs.expo.dev/router/reference/src-directory/) 규약이며, **Expo SDK 54에서도 별도 플러그인 없이 동작**합니다 (`src/app`이 루트 `app`보다 우선).

저장소를 clone한 뒤 **프로젝트 루트**에서 진행합니다. `docs/`, `.vscode/`, `agent.md`는 그대로 두고 앱 코드만 얹습니다.

## 진행 방식 선택

`create-expo-app`은 **비어 있지 않은 디렉터리**에 `pnpm create expo-app@latest .`를 실행하면 거부되거나 덮어쓰기 충돌이 납니다. 이 저장소는 clone 시점에 `docs/`, `agent.md`, `README.md`, `.vscode/` 등이 이미 있으므로 **B(임시 디렉터리 → 병합)** 를 권장합니다.

| 방식 | 조건 | 1단계 |
|---|---|---|
| **A. 루트 직접** | 루트에 Expo 앱 파일이 거의 없을 때 | 아래 [1-A단계](#1-a단계-create-expo-app-루트-직접) |
| **B. 임시 디렉터리 후 병합** | `docs/`·`agent.md` 등 보일러플레이트 파일이 있을 때 (**권장**) | 아래 [1-B단계](#1-b단계-create-expo-app-임시-디렉터리--병합) |

B 방식으로 생성한 뒤에는 **2단계부터 동일**하게 진행합니다.

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

`default`는 Expo Router + TypeScript + `expo-router/entry` 진입점입니다. 다른 템플릿(`tabs`, `blank-typescript`)도 가능합니다.

### 1-A단계: create-expo-app (루트 직접)

루트가 비어 있거나 Expo 관련 파일만 덮어써도 될 때:

```sh
pnpm create expo-app@latest . --template default --yes
```

### 1-B단계: create-expo-app (임시 디렉터리 → 병합)

`docs/`, `agent.md`, `README.md` 등 **기존 파일을 유지**해야 할 때 사용합니다.

#### 1) 임시 디렉터리에 앱 생성

프로젝트 **루트의 상위 폴더**에서 임시 이름으로 생성합니다. (`expo-bootstrap-tmp`는 예시)

```sh
cd ..   # react-native-expo-boilerplate 의 부모 디렉터리
pnpm create expo-app@latest expo-bootstrap-tmp --template default --yes
```

#### 2) 보일러플레이트 파일 보존 목록

병합 시 **덮어쓰지 않을** 경로입니다.

| 보존 | 이유 |
|---|---|
| `docs/` | 프로젝트 가이드 |
| `agent.md` | AI·작업 지침 |
| `README.md` | 보일러플레이트 소개 |
| `.vscode/` | 에디터 설정 |
| `.gitlab/` | MR 템플릿 등 |
| `.git/` | Git 메타데이터 |
| `.gitignore` | 저장소용 ignore (Expo 항목 이미 포함) |

#### 3) 생성물을 루트로 병합

다시 **프로젝트 루트**로 이동한 뒤, 임시 디렉터리 내용을 복사합니다.

```sh
cd react-native-expo-boilerplate   # clone한 저장소 루트

rsync -av \
  --exclude='.git' \
  --exclude='README.md' \
  --exclude='docs' \
  --exclude='agent.md' \
  --exclude='.vscode' \
  --exclude='.gitlab' \
  --exclude='.gitignore' \
  ../expo-bootstrap-tmp/ .
```

`rsync` 후에도 템플릿 `app/`이 루트에 복사됩니다. 아래 [버전 고정](#버전-고정-ab-공통) 직후 **`src/app` 이동** 단계를 진행하세요.

`rsync`가 없으면 핵심 항목만 수동 복사합니다.

```sh
cp -R ../expo-bootstrap-tmp/assets .
cp ../expo-bootstrap-tmp/app.json ../expo-bootstrap-tmp/package.json .
cp ../expo-bootstrap-tmp/tsconfig.json ../expo-bootstrap-tmp/babel.config.js . 2>/dev/null || true
cp ../expo-bootstrap-tmp/metro.config.js ../expo-bootstrap-tmp/.npmrc . 2>/dev/null || true
cp ../expo-bootstrap-tmp/pnpm-lock.yaml . 2>/dev/null || true
mkdir -p src
cp -R ../expo-bootstrap-tmp/app src/app
```

#### 4) 충돌·누락 점검

| 파일 | 처리 |
|---|---|
| `package.json` | 임시 디렉터리에서 복사한 것을 사용 (아직 없었다면 신규 생성) |
| `.gitignore` | **보일러플레이트 버전 유지**. 템플릿에만 있는 항목이 있으면 수동으로 추가 |
| `README.md` | **보일러플레이트 버전 유지** |
| `.npmrc` | 복사됐는지 확인. 없으면 아래 `node-linker=hoisted` 블록 추가 |

#### 5) 임시 디렉터리 삭제

병합·실행 확인 후 상위 폴더의 임시 디렉터리를 제거합니다.

```sh
rm -rf ../expo-bootstrap-tmp
```

#### 6) 의존성 설치

루트에 `pnpm-lock.yaml`이 복사됐다면:

```sh
pnpm install
```

lock 파일이 없거나 설치 오류가 나면 `pnpm install`로 루트에서 다시 잡습니다.

### 버전 고정 (A·B 공통)

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

### `src/app`으로 라우트 이동 (A·B 공통)

템플릿은 루트 `app/`을 생성합니다. 보일러플레이트 규약에 맞게 **`src/app/`** 으로 옮깁니다.

```sh
mkdir -p src
mv app src/app
```

| 항목 | 내용 |
|---|---|
| Expo SDK 54 | `src/app` 자동 인식. 추가 config plugin 불필요 |
| 우선순위 | `src/app`과 루트 `app/`이 동시에 있으면 **`src/app`만** 사용됨 — 이동 후 루트 `app/`이 남지 않았는지 확인 |
| 루트에 둘 파일 | `app.json`, `package.json`, `babel.config.js`, `metro.config.js`, `tsconfig.json`, `global.css` 등 |

`tsconfig.json`의 path alias가 `@/*` → `./*`이면 `./src/*`로 바꿉니다.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
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
    "./src/app/**/*.{js,jsx,ts,tsx}",
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

`src/app/_layout.tsx` 최상단:

```tsx
import "../../global.css";
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

B 방식(임시 디렉터리 병합)을 썼다면, `docs/`, `agent.md`, `README.md`, `.vscode/`가 그대로인지 먼저 확인합니다.

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
