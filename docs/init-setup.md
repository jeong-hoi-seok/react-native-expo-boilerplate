# 초기 설치 가이드

> **이 문서는 프로젝트 최초 부트스트랩(1회)에만 사용합니다.**  
> 이후 의존성 추가·기능 설정은 `agent.md`를 따릅니다.

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

> Zustand 등 추가 라이브러리는 `agent.md`를 참고하세요.

## 사전 요구사항

| 도구 | 용도 |
|---|---|
| [Node.js](https://nodejs.org/) **22+** | 런타임 (`nano-staged@1.x` git hook이 node `^22 \|\| >=24` 요구) |
| [pnpm](https://pnpm.io/installation) | 패키지 매니저 (**필수**) |
| Xcode (macOS) | iOS 빌드 |
| Android Studio | Android 빌드 |

## 1단계: create-expo-app + 버전 고정

`default`는 Expo Router + TypeScript + `expo-router/entry` 진입점입니다. 다른 템플릿(`tabs`, `blank-typescript`)도 가능합니다.

> **⚠️ SDK 버전 핀 — 템플릿 버전을 명시합니다.**
> `create-expo-app@latest --template default`는 **항상 최신 SDK**(현재 SDK 56)를 생성합니다. 이 보일러플레이트는 **SDK 54 고정**이므로, 템플릿 패키지 버전을 핀해 처음부터 SDK 54로 생성합니다.
>
> ```sh
> --template expo-template-default@54.0.35
> ```
>
> 최신(SDK 56)으로 생성한 뒤 `expo`/`react`/`react-native` 3개만 다운그레이드하면 나머지 `expo-*` 패키지가 SDK 56에 남아 **빌드가 깨집니다**. 반드시 템플릿 버전으로 생성하세요. (`expo-template-default` 버전 = 대응 SDK 패치 버전)

### 1-A단계: create-expo-app (루트 직접)

루트가 비어 있거나 Expo 관련 파일만 덮어써도 될 때:

```sh
pnpm create expo-app@latest . --template expo-template-default@54.0.35 --yes
```

### 1-B단계: create-expo-app (임시 디렉터리 → 병합)

`docs/`, `agent.md`, `README.md` 등 **기존 파일을 유지**해야 할 때 사용합니다.

#### 1) 임시 디렉터리에 앱 생성

프로젝트 **루트의 상위 폴더**에서 임시 이름으로 생성합니다. (`expo-bootstrap-tmp`는 예시)

```sh
cd ..   # react-native-expo-boilerplate 의 부모 디렉터리
pnpm create expo-app@latest expo-bootstrap-tmp --template expo-template-default@54.0.35 --yes
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

### `src/`로 코드 이동 (A·B 공통)

SDK 54 `default` 템플릿은 **루트에** `app/`, `components/`, `hooks/`, `constants/`를 만들고, alias는 `@/*` → `./*`입니다. 보일러플레이트는 **모든 소스를 `src/` 아래**에 두므로 함께 옮깁니다. (라우트뿐 아니라 `@/components` 등 데모 import가 `./src/*`로 해소되도록)

```sh
mkdir -p src
mv app src/app
# 템플릿 데모 소스도 src로 (alias가 ./src/*를 가리키므로 같이 이동해야 import가 깨지지 않음)
mv components hooks constants src/ 2>/dev/null || true
```

| 항목 | 내용 |
|---|---|
| Expo SDK 54 | `src/app` 자동 인식. 추가 config plugin 불필요 |
| 우선순위 | `src/app`과 루트 `app/`이 동시에 있으면 **`src/app`만** 사용됨 — 이동 후 루트 `app/`이 남지 않았는지 확인 |
| 루트에 둘 것 | `app.json`, `package.json`, `babel.config.js`, `metro.config.js`, `tsconfig.json`, `styles/`, `assets/` 등 |

`tsconfig.json`의 path alias를 `./src/*`로 바꾸고, **루트 `assets/`용 별칭을 추가**합니다. (이미지는 `app.json`이 `./assets/...`로도 참조하므로 루트에 유지)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/assets/*": ["./assets/*"]
    }
  }
}
```

> 코드에서 이미지는 `require("@/assets/images/...")`로 import합니다. `@/assets` 별칭이 없으면 Metro 번들 시 `Unable to resolve module @/assets/...` 오류가 납니다.

## 2단계: FSD 폴더 (src 아래)

FSD 레이어(`features`·`entities`·`shared`)는 **`src/` 아래**에 둡니다.

```sh
mkdir -p src/features src/entities src/shared/ui src/shared/lib src/shared/config styles
```

템플릿 데모 컴포넌트를 FSD에 맞게 `src/shared`로 재배치합니다. (1단계에서 옮긴 `src/components`·`src/hooks`·`src/constants` 정리)

| 원본 | 이동 위치 | 비고 |
|---|---|---|
| `components/*` (themed-text, themed-view, haptic-tab, ui/icon-symbol 등) | `src/shared/ui/` | 재사용 컴포넌트 |
| `hooks/*` (use-color-scheme, use-theme-color) | `src/shared/lib/` | 훅·유틸 |
| `constants/theme.ts` | `src/shared/config/` | 상수·테마 |
| 데모 전용 (hello-wave, parallax-scroll-view, collapsible, external-link) | 삭제 | 보일러플레이트 불필요 |

각 세그먼트에 `index.ts` 배럴을 만들고, import는 `@/shared/ui`·`@/shared/lib`·`@/shared/config` public API로만 합니다. 이동 후 `@/components`·`@/hooks`·`@/constants` 참조를 새 경로로 바꿉니다. 구조·import 규칙은 `agent.md`를 따릅니다.

## 3단계: NativeWind

스타일은 **NativeWind `className`** 1순위 (`agent.md`).

> Expo SDK 54는 Reanimated v4를 씁니다. **NativeWind `4.2.1` 이상**이 필요합니다.

### 설치

`default` 템플릿(SDK 54)은 이미 `react-native-reanimated`·`react-native-safe-area-context`를 **SDK 54 호환 버전**으로 설치해 둡니다. **무지성 `pnpm add`로 최신 버전을 덮어쓰지 마세요** (SDK 54와 어긋남). 부족한 것만 추가합니다.

```sh
pnpm add nativewind@^4.2.1 class-variance-authority clsx tailwind-merge
pnpm add -D tailwindcss@^3.4.17
pnpm exec tailwindcss init
mkdir -p styles
```

> reanimated·safe-area-context가 없다면 `pnpm expo install react-native-reanimated react-native-safe-area-context`로 **SDK 호환 버전**을 받습니다 (`pnpm add` 최신 X).

### tailwind.config.js

FSD가 모두 `src/` 아래이므로 `./src/**` 하나로 커버합니다.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
```

`styles/global.css`:

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

module.exports = withNativeWind(config, { input: "./styles/global.css" });
```

### 연결

`src/app/_layout.tsx` 최상단:

```tsx
import "../../styles/global.css";
```

루트 `nativewind-env.d.ts` (`nativewind.d.ts`, `app.d.ts` 이름 금지):

```ts
/// <reference types="nativewind/types" />
```

`className` 적용을 확인한 뒤 캐시를 지우고 실행합니다.

### CVA · `cn` 유틸

variant 기반 공용 UI용 패키지는 위 설치에 포함됩니다. `src/shared/lib/cn.ts`를 추가하고 `@/shared/lib`에서 export합니다.

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

패턴·예시(`ThemedText` 등)는 `docs/styling.md`를 참고합니다.

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
- **`global.css` 대응** — Biome 2.x는 Tailwind 지시문 `@tailwind`를 `noUnknownAtRules`로 잡습니다. `*.css`에서 해당 규칙을 끕니다.

```json
{
  "overrides": [
    {
      "includes": ["**/*.css"],
      "linter": { "rules": { "suspicious": { "noUnknownAtRules": "off" } } }
    }
  ]
}
```

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

## 5단계: Git hooks (husky + nano-staged)

커밋·푸시 전에 품질 게이트를 자동 실행합니다.

| 훅 | 실행 | 목적 |
|---|---|---|
| `pre-commit` | `pnpm exec nano-staged` | **스테이징된 파일만** Biome 자동수정 후 재-stage |
| `pre-push` | `pnpm typecheck` | 푸시 전 전체 타입 검사 |

> ⚠️ **node 버전** — `nano-staged@1.x`는 **node `^22 || >=24`**를 요구합니다. 협업자 node 버전이 낮으면 `nano-staged@0.8` 또는 아래 Biome 네이티브 방식을 쓰세요.

### 설치

```sh
pnpm add -D husky nano-staged
pnpm exec husky init   # .husky/ 생성 + package.json에 "prepare": "husky" 추가
```

`husky init`이 만든 `.husky/pre-commit`(기본 `pnpm test`)을 교체하고 `pre-push`를 추가합니다. (husky v9 = 셰뱅·부트스트랩 줄 불필요, 명령만)

```sh
# .husky/pre-commit
pnpm exec nano-staged
```

```sh
# .husky/pre-push
pnpm typecheck
```

### nano-staged 설정 (`package.json`)

```json
{
  "nano-staged": {
    "*.{js,jsx,ts,tsx,json,jsonc,css}": "biome check --write --no-errors-on-unmatched"
  }
}
```

- `biome check --write`가 스테이징 파일을 자동수정 → nano-staged가 **수정분을 재-stage**합니다.
- 고칠 수 없는 lint 에러는 exit 1 → 커밋 차단(의도된 동작).

> **대안 — Biome 네이티브 `--staged`**: 이 프로젝트는 lint·format을 Biome 하나로 처리하므로, nano-staged 없이 `biome check --staged --write`만으로도 됩니다. 단 자동수정분 재-stage는 직접 `git add`해야 합니다. 멀티 툴체인이 아니면 둘 다 유효 — auto-fix+restage 편의는 nano-staged, 의존성 최소화는 Biome 네이티브.

### 동작 확인

```sh
git config core.hooksPath          # .husky/_ 출력 확인
git hook run pre-push              # typecheck 실행 확인
```

## 6단계: 검증

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
