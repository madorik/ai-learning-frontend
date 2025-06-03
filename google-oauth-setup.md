# 프론트엔드 프록시 로그인 가이드

## 📋 개요

이 프로젝트는 프론트엔드 서버(9090번 포트)에서 백엔드 서버(3000번 포트)로 프록시하는 방식으로 Google OAuth 인증을 처리합니다.
사용자는 9090번 포트의 API를 호출하고, 내부적으로 3000번 포트의 백엔드 서버와 통신합니다.

## 🔗 시스템 구성

```
Frontend UI          Frontend API         Backend Server        Google OAuth
Port: 9090      →    Port: 9090      →    Port: 3000      →    OAuth 2.0
(React)              (Next.js API)        (AI + Auth)
```

## ⚙️ 환경 변수 설정

### .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 백엔드 API 서버 URL (프록시 대상)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🚀 로그인 플로우

### 1. 로그인 시작
```
사용자 → "구글로 로그인" 클릭 → 9090/auth/google API 호출
```

### 2. 프록시 처리
```
9090/auth/google → 3000/auth/google로 리디렉션 → Google OAuth 처리
```

### 3. Google OAuth 처리
```
백엔드(3000)에서 Google OAuth 처리 → Google 인증 → 백엔드에서 토큰 생성
```

### 4. 프론트엔드 복귀
```
백엔드 → 토큰과 사용자 정보를 URL 파라미터로 전달 → 프론트엔드(9090)
```

### 5. 토큰 저장
```
프론트엔드 → localStorage에 토큰 저장 → 로그인 상태 유지
```

## 🔧 API 엔드포인트

### 프론트엔드 API (9090번 포트)
| 엔드포인트 | 메서드 | 설명 | 프록시 대상 |
|-----------|--------|------|------------|
| `/auth/google` | GET | Google OAuth 로그인 시작 | `3000/auth/google` |
| `/auth/logout` | POST | 로그아웃 처리 | `3000/auth/logout` |
| `/api/user/me` | GET | 사용자 정보 조회 | `3000/api/user/me` |

### 백엔드 API (3000번 포트)
- **실제 OAuth 처리 서버**
- **AI 기능 통합 서버**
- **데이터베이스 연결 서버**

## 💻 사용 방법

### 개발 서버 실행

#### 1. 프론트엔드 (포트 9090)
```bash
pnpm dev
```

#### 2. 백엔드 서버 확인
백엔드 서버가 3000번 포트에서 실행 중인지 확인하세요.

### 로그인 테스트

1. **브라우저에서 접속**: `http://localhost:9090`
2. **Header에서 "로그인" 버튼 클릭** → `/login` 페이지로 이동
3. **"구글로 로그인" 버튼 클릭** → `http://localhost:9090/auth/google` 호출
4. **프록시 처리**: 9090 → 3000으로 자동 리디렉션
5. **Google OAuth 인증 완료**
6. **프론트엔드로 복귀**: 토큰과 함께 로그인 페이지로 돌아옴
7. **로그인 상태 확인**: 사용자 정보가 표시됨

## 🛡️ 보안 특징

- **프록시 방식**: 프론트엔드에서 직접 백엔드로 프록시하여 안전한 통신
- **단일 진입점**: 모든 API 호출이 9090번 포트로 통일
- **토큰 기반 인증**: 프론트엔드는 백엔드에서 발급한 토큰 사용
- **CORS 해결**: 프록시를 통해 CORS 문제 자동 해결

## 🔍 API 호출 예시

### 프론트엔드에서 API 호출

```typescript
// 로그인 (리디렉션 방식)
const handleLogin = () => {
  window.location.href = 'http://localhost:9090/auth/google';
};

// 사용자 정보 조회 (현재 도메인 사용)
const getUserInfo = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/user/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// 로그아웃 (현재 도메인 사용)
const handleLogout = async () => {
  const token = localStorage.getItem('access_token');
  await fetch('/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};
```

## 🔧 문제 해결

### 자주 발생하는 오류

1. **API 라우트 404 오류**
   - Next.js 개발 서버 재시작 확인
   - app/auth/google/route.ts 파일 존재 확인

2. **백엔드 연결 실패**
   - 백엔드 서버가 3000번 포트에서 실행 중인지 확인
   - `NEXT_PUBLIC_API_URL` 환경 변수 확인

3. **로그인 콜백 오류**
   - 백엔드에서 9090번 포트로 콜백 URL 설정 확인
   - 브라우저 콘솔에서 에러 메시지 확인

4. **프록시 오류**
   - 네트워크 탭에서 API 호출 상태 확인
   - 서버 로그에서 프록시 요청 확인

### 개발자 도구 확인

브라우저의 개발자 도구에서 다음을 확인할 수 있습니다:

- **Network 탭**: 
  - `/auth/google` → 리디렉션 확인
  - `/api/user/me` → 프록시 요청 확인
- **Console 탭**: 로그인 과정의 로그
- **Application 탭 > Local Storage**: 저장된 토큰 확인

## 📁 생성된 파일 구조

```
app/
├── auth/
│   ├── google/
│   │   └── route.ts        # GET /auth/google (프록시)
│   └── logout/
│       └── route.ts        # POST /auth/logout (프록시)
└── api/
    └── user/
        └── me/
            └── route.ts    # GET /api/user/me (프록시)
```

## 🚀 배포 시 주의사항

### 프로덕션 환경 변수

```env
# 프로덕션 백엔드 URL
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### 도메인 설정

1. **백엔드 콜백 URL**: 프로덕션 프론트엔드 도메인으로 설정
2. **Google OAuth 설정**: 백엔드에서 프로덕션 도메인으로 OAuth 설정
3. **HTTPS 사용**: 프로덕션에서는 반드시 HTTPS 사용

## ✅ 장점

- **단일 포트**: 사용자는 9090번 포트만 사용
- **CORS 해결**: 프록시를 통해 CORS 문제 자동 해결
- **유지보수**: API 엔드포인트가 프론트엔드에서 관리됨
- **개발 편의성**: 백엔드 변경 없이 프론트엔드에서 제어 가능

이제 9090번 포트에서 모든 인증과 API 호출을 처리하는 깔끔한 프록시 시스템이 완성되었습니다! 🎉 