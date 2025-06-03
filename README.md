# AI 문제지 생성기 (프론트엔드)

Next.js 15 + React 19 + Tailwind CSS로 구축된 AI 문제지 생성 서비스의 프론트엔드입니다.

## 🚀 주요 기능

- **백엔드 연동 로그인**: 기존 백엔드 서버(3000 포트)의 Google OAuth 인증 시스템
- **반응형 UI**: Tailwind CSS와 shadcn/ui 컴포넌트 기반 모던 인터페이스
- **TypeScript**: 안전한 타입 시스템으로 개발

## 🛠️ 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 3
- **UI 컴포넌트**: shadcn/ui (Radix UI 기반)
- **아이콘**: Lucide React
- **패키지 매니저**: pnpm

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 백엔드 API 서버 URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. 개발 서버 실행
```bash
pnpm dev
```

프론트엔드는 http://localhost:9090 에서 실행됩니다.

## 🔗 백엔드 연동

이 프론트엔드는 별도의 백엔드 서버와 연동됩니다:

- **백엔드 서버**: http://localhost:3000
- **인증 방식**: 백엔드 서버의 Google OAuth 리디렉션
- **API 통신**: Bearer Token 기반 인증

### 로그인 플로우

1. 사용자가 "구글로 로그인" 버튼 클릭
2. 백엔드 `/auth/google` 엔드포인트로 리디렉션
3. Google OAuth 인증 완료 후 백엔드에서 토큰 발급
4. 토큰과 사용자 정보가 URL 파라미터로 프론트엔드에 전달
5. 프론트엔드에서 토큰을 localStorage에 저장

### API 호출 예시

```typescript
// 인증이 필요한 API 호출
const token = localStorage.getItem('access_token');
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📁 프로젝트 구조

```
├── app/                    # Next.js 15 App Router
│   ├── globals.css        # 글로벌 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx          # 홈페이지
│   └── login/            # 로그인 페이지
│       └── page.tsx
├── components/            # React 컴포넌트
│   ├── simple-login.tsx  # 백엔드 연동 로그인
│   └── ui/               # shadcn/ui 컴포넌트
├── lib/                  # 유틸리티 함수
│   └── utils.ts
└── public/               # 정적 파일
```

## 🎨 코딩 스타일 가이드

- **들여쓰기**: 2칸 스페이스
- **변수명**: camelCase
- **상수명**: SNAKE_CASE
- **파일명**: kebab-case
- **주석**: 한글, 필요한 부분만 최소한으로

## 🔧 환경 설정

### 포트 설정
- **프론트엔드**: 9090
- **백엔드**: 3000

### 개발 도구
- **ESLint**: 코드 품질 검사
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링

## 📝 주요 컴포넌트

### SimpleLogin
백엔드 서버와 연동되는 로그인 컴포넌트

```tsx
<SimpleLogin 
  onLoginSuccess={(user) => console.log('로그인 성공:', user)}
  onLoginError={(error) => console.error('로그인 오류:', error)}
/>
```

**기능:**
- 백엔드 Google OAuth 리디렉션
- 로그인 콜백 처리
- 토큰 관리 (localStorage)
- 로그아웃 처리
- API 호출 테스트

## 🚀 배포

### 빌드
```bash
pnpm build
```

### 프로덕션 실행
```bash
pnpm start
```

### 환경 변수 (프로덕션)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## 🤝 백엔드 협업

이 프론트엔드는 다음 백엔드 API와 연동됩니다:

- `GET /auth/google` - Google OAuth 로그인 시작
- `POST /auth/logout` - 로그아웃
- `GET /api/user/me` - 사용자 정보 조회
- 기타 AI 문제지 생성 관련 API

백엔드 서버가 3000번 포트에서 실행 중이어야 합니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 