# 스타일링 가이드

이 프로젝트의 UI 스타일은 **NativeWind `className`**이 기본입니다. variant가 있는 공용 컴포넌트는 **CVA(class-variance-authority)** + **`cn`** 유틸을 씁니다.

상위 규칙·우선순위는 `agent.md`의 「스타일링」 섹션을 따릅니다. 공식 API·동작은 `docs/official-docs-reference.md`의 NativeWind·CVA 링크를 확인합니다.

## 우선순위

| 순위 | 방식 | 사용 시점 |
|---|---|---|
| **1** | NativeWind `className` | 레이아웃, 색, 타이포, 간격, 다크 모드 등 **기본** |
| **1-b** | CVA + `cn` | 버튼·텍스트처럼 **variant가 있는 공용 UI** |
| **2** | `StyleSheet.create` | NativeWind로 표현이 어렵거나 불가능할 때만 |
| **3** | inline `style` | 런타임 동적 값(`useThemeColor` prop 색 등) |

새 화면·컴포넌트는 `StyleSheet`부터 시작하지 않습니다.

## 파일·설정 위치

| 경로 | 역할 |
|---|---|
| `styles/global.css` | Tailwind 진입점 (`@tailwind` 지시문). 루트 `styles/` |
| `tailwind.config.js` | `content: ["./src/**/*.{js,jsx,ts,tsx}"]` |
| `metro.config.js` | `withNativeWind(config, { input: "./styles/global.css" })` |
| `src/app/_layout.tsx` | `import "../../styles/global.css"` |
| `src/shared/lib/cn.ts` | `twMerge(clsx(...))` — 클래스 병합·충돌 해결 |
| `src/shared/config/theme.ts` | JS 측 테마 상수 (`Colors`, `Fonts`) |
| `nativewind-env.d.ts` | NativeWind 타입 (`className` on RN 컴포넌트) |

CVA variant 정의는 **`src/` 아래**에 둡니다. Tailwind가 `content` 경로로 클래스 문자열을 스캔하기 때문입니다.

## 패키지

| 패키지 | 용도 |
|---|---|
| `nativewind` | RN에서 Tailwind `className` |
| `tailwindcss` | Tailwind 컴파일 (dev) |
| `class-variance-authority` | variant → className 문자열 |
| `clsx` | 조건부 클래스 조합 |
| `tailwind-merge` | 충돌 클래스 병합 (`text-base` + `text-xl` 등) |

NativeWind v4는 `className`을 컴포넌트에 그대로 전달하므로 CVA·`clsx`·`tailwind-merge`와 함께 쓸 수 있습니다. ([NativeWind v4 Announcement](https://www.nativewind.dev/blog/announcement-nativewind-v4))

## `cn` 유틸

```ts
import { cn } from "@/shared/lib";

<View className={cn("flex-1 p-4", isActive && "bg-blue-500", className)} />
```

- variant 결과 + 사용자 `className`을 합칠 때 **항상 `cn`을 통과**시킵니다.
- VS Code Tailwind 확장은 `.vscode/settings.json`에서 `cn`·`clsx`를 `classFunctions`로 인식합니다.

## CVA 패턴

### 기본 형태

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, type PressableProps } from "react-native";

import { cn } from "@/shared/lib";

const buttonVariants = cva("rounded-lg items-center justify-center", {
  variants: {
    intent: {
      primary: "bg-blue-500",
      secondary: "bg-gray-200",
    },
    size: {
      sm: "px-3 py-2",
      md: "px-4 py-3",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

type ButtonProps = PressableProps & VariantProps<typeof buttonVariants>;

export const Button = ({ intent, size, className, ...props }: ButtonProps) => (
  <Pressable className={cn(buttonVariants({ intent, size }), className)} {...props} />
);
```

### 프로젝트 예시: `ThemedText`

`src/shared/ui/themed-text.tsx` — `type` variant + `themed` variant(라이트/다크 텍스트 색).

```tsx
const themedTextVariants = cva("", {
  variants: {
    type: {
      default: "text-base leading-6",
      title: "text-[32px] font-bold leading-8",
      link: "text-base leading-[30px] text-[#0a7ea4]",
      // ...
    },
    themed: {
      true: "text-[#11181C] dark:text-[#ECEDEE]",
      false: "",
    },
  },
  defaultVariants: { type: "default", themed: true },
});

// link·커스텀 색상일 때 themed 비활성화
className={cn(themedTextVariants({ type, themed: useThemeClass }), className)}
```

- `link`처럼 테마 색과 다른 variant는 **별도 클래스**로 두고, base `themed` 색과 겹치지 않게 합니다.
- `lightColor` / `darkColor` prop은 CVA로 표현하기 어려우므로 `style={{ color }}`로 처리합니다 (`agent.md` 3순위).

## 화면 vs 공용 컴포넌트

| 대상 | 권장 |
|---|---|
| 화면 (`src/app/**`) | `View`·`SafeAreaView`에 `className` 직접 사용 |
| 공용 UI (`src/shared/ui/**`) | variant가 있으면 CVA, 단순하면 `className`만 |
| feature UI | 재사용·variant가 늘면 `shared/ui`로 승격 검토 |

## 다크 모드

- Tailwind `dark:` 접두사 사용 (`dark:text-[#ECEDEE]`).
- 시스템 테마는 NativeWind + `useColorScheme`(`@/shared/lib`)과 연동됩니다.
- JS 상수 색은 `src/shared/config/theme.ts`의 `Colors`를 참고합니다. Tailwind 클래스와 값을 맞출 때는 양쪽을 함께 갱신합니다.

## 주의사항

1. **동적 클래스 문자열 금지** — `` `text-${size}` ``는 NativeWind가 인식하지 못합니다. CVA variant나 정적 리터럴만 사용합니다.
2. **`twMerge` 없이 문자열 합치기 지양** — override 시 충돌 클래스가 같이 남을 수 있습니다.
3. **3rd party 컴포넌트** — `className`을 내려주지 않으면 NativeWind가 동작하지 않습니다. 필요 시 `remapProps` / `cssInterop` ([NativeWind 가이드](https://www.nativewind.dev/docs/guides/third-party-components)).
4. **설정 변경 후** — `metro.config.js`·`babel.config.js`·`styles/global.css` 수정 후 `pnpm exec expo start -c`. 네이티브 재빌드가 필요할 수 있습니다.

## 초기 설치

NativeWind·CVA 패키지 설치와 Metro 연동은 `docs/init-setup.md` 3단계를 따릅니다.
