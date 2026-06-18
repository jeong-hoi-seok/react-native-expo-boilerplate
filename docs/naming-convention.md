# 네이밍 컨벤션

## 1. 파일명 — kebab-case

모든 파일·디렉토리는 kebab-case.

```
✅ use-auth-store.ts
✅ user-profile/
✅ settings-form.tsx
✅ user-card.test.tsx

❌ UserProfile.tsx
❌ useAuthStore.ts
❌ user_profile/
❌ SettingsForm.tsx
```

예외:
- Expo Router 동적 라우트: `[id].tsx`, `[...slug].tsx` (Expo 규약)
- Expo Router 그룹: `(tabs)/`, `(auth)/` (Expo 규약)
- 설정 파일: `tsconfig.json`, `biome.json` 등 도구 강제 규약

## 2. 내부 식별자

| 종류 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase | `UserProfile`, `SettingsForm`, `UserCard` |
| 훅 | camelCase, `use` prefix | `useAuthStore`, `useTheme` |
| 함수 | camelCase | `fetchUser`, `formatDate` |
| 변수 | camelCase | `currentUser`, `isLoading` |
| 상수 | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE`, `MAX_RETRY` |
| 타입/인터페이스 | PascalCase | `ApiResponse`, `UserState` |
| 제네릭 | PascalCase, 한 글자 또는 의미 있는 이름 | `T`, `TPayload` |
| enum 멤버 | PascalCase | `UserRole.Admin` |
| zustand store | camelCase, `Store` suffix | `authStore`, `themeStore` |
| 이벤트 핸들러 | `handle*` / `on*` | `handleSubmit`, `onPress` |
| boolean | `is/has/should/can` prefix | `isReady`, `hasError`, `shouldRefresh` |

## 3. 파일 ↔ 식별자 매핑 규칙

**파일명은 kebab-case, 내부 export는 PascalCase/camelCase로 변환.**

```ts
// user-profile.tsx
export function UserProfile() { ... }

// use-auth-store.ts
export function useAuthStore() { ... }

// user-role.ts
export type UserRole = ...

// default-page-size.ts
export const DEFAULT_PAGE_SIZE = 20;
```

**약어 처리**: 약어도 PascalCase 규칙 따름. 전부 대문자 금지.

```
✅ ApiClient       (API → Api)
✅ useApiClient    (API → Api)
✅ HtmlParser      (HTML → Html)
✅ UuidGenerator   (UUID → Uuid)

❌ APIClient
❌ useAPIClient
❌ HTMLParser
❌ UUIDGenerator
```

이유: 약어 연속 시 경계 모호 (`useAPIURL` vs `useApiUrl`). 일관성 위해 첫 글자만 대문자.

## 4. 디렉토리 구조 명명

FSD slice 내부 디렉토리는 고정 이름 사용.

```
src/features/user-profile/
├── ui/           # 컴포넌트
├── model/        # 상태, 타입, 비즈니스 로직
├── api/          # 외부 통신
├── lib/          # 순수 유틸
└── index.ts      # public API
```

slice 자체 이름은 kebab-case + 도메인-기능 형태.

```
✅ user-profile
✅ auth-form
✅ settings-screen
✅ notification-list

❌ userProfile
❌ UserProfile
❌ profile  (도메인 모호)
```

## 5. 테스트 / 스토리북 파일

```
user-profile.tsx
user-profile.test.tsx       # 유닛
user-profile.e2e.ts         # E2E
user-profile.stories.tsx    # 스토리북 (도입 시)
```

## 6. 에셋

- 이미지: `kebab-case.png` — `profile-avatar.png`, `logo-dark.png`
- 폰트: `kebab-case` — `pretendard-bold.ttf`
- 외부 도구가 강제하는 원본 파일명(번들 manifest, 네이티브 리소스 등)은 도구 규약 우선. 래퍼·import 경로만 kebab-case 유지.

## 7. RN 특수 케이스

- 플랫폼별 파일: `component.ios.tsx`, `component.android.tsx`, `component.web.tsx` (RN resolver 규약)
- 환경별 파일: `config.dev.ts`, `config.prod.ts`

## 8. 자동 검증

Biome 규칙으로 강제 (도입 후):

```jsonc
{
  "linter": {
    "rules": {
      "style": {
        "useFilenamingConvention": {
          "level": "error",
          "options": { "filenameCases": ["kebab-case"] }
        },
        "useNamingConvention": "error"
      }
    }
  }
}
```
