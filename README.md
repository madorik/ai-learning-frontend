# AI 초등 수학 문제지 생성기

AI를 활용하여 초등학생을 위한 맞춤형 수학 문제지를 생성하는 웹 애플리케이션입니다.

## 🎯 주요 기능

- **맞춤형 문제 생성**: 학년별, 과목별 최적화된 문제 자동 생성
- **다양한 과목 지원**: 수학, 국어, 영어 
- **문제 유형 선택**: 교과과정 기반, 수행평가, 모의고사
- **문제 수 설정**: 10개, 20개, 30개 중 선택
- **해설 포함 옵션**: 선택적으로 자세한 해설 제공
- **다양한 다운로드 형식**: PDF, Word 형식 지원
- **직관적인 UI/UX**: 학부모와 선생님이 쉽게 사용할 수 있는 모던한 인터페이스
- **생성 기록 관리**: 과거 생성된 문제지 히스토리 관리
- **로그인 시스템**: 개인화된 서비스 제공

## 🛠 기술 스택

### Frontend & Backend (Full-Stack)
- **Next.js 15.2.4**: React 기반 풀스택 프레임워크
- **React 19**: 최신 React 버전
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **Radix UI**: 접근성을 고려한 UI 컴포넌트 라이브러리

### UI/UX 라이브러리
- **Lucide React**: 아이콘 라이브러리
- **React Hook Form**: 폼 상태 관리
- **Zod**: 스키마 검증
- **Sonner**: 토스트 알림
- **Date-fns**: 날짜 처리
- **Recharts**: 차트 라이브러리

### 기타 도구
- **PNPM**: 패키지 매니저
- **ESLint**: 코드 품질 검사
- **PostCSS**: CSS 후처리

## 📁 프로젝트 구조

```
ai-learning/
├── app/                   # Next.js App Router
│   ├── create/           # 문제지 생성 페이지
│   ├── history/          # 생성 기록 페이지
│   ├── login/            # 로그인 페이지
│   ├── layout.tsx        # 루트 레이아웃
│   ├── page.tsx          # 홈페이지
│   └── globals.css       # 글로벌 스타일
├── components/           # 재사용 가능한 컴포넌트
│   └── ui/              # UI 컴포넌트 라이브러리
├── lib/                 # 유틸리티 함수
├── hooks/               # 커스텀 React 훅
├── styles/              # 스타일 파일
├── public/              # 정적 파일
├── package.json         # 프로젝트 의존성
├── tailwind.config.ts   # Tailwind CSS 설정
├── tsconfig.json        # TypeScript 설정
└── next.config.mjs      # Next.js 설정
```

## 🚀 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd ai-learning
```

### 2. 패키지 설치
```bash
# PNPM 사용 (권장)
pnpm install

# 또는 NPM 사용
npm install
```

### 3. 환경변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가:
```env
# AI API 설정
NEXT_PUBLIC_AI_API_KEY=your_ai_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 기타 설정
NODE_ENV=development
```

### 4. 개발 서버 실행
```bash
# 개발 모드
pnpm dev

# 또는
npm run dev
```

서버가 실행되면 `http://localhost:3000`에서 애플리케이션을 확인할 수 있습니다.

### 5. 빌드 및 배포
```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

## 📖 사용 방법

1. **홈페이지 접속**: `http://localhost:3000`에서 서비스 소개 확인
2. **문제지 생성**: "문제지 만들기" 버튼 클릭 또는 `/create` 페이지로 이동
   - 과목 선택 (수학/국어/영어)
   - 학년 선택 (1-6학년)
   - 문제 유형 선택 (교과과정 기반/수행평가/모의고사)
   - 문제 개수 설정 (10개/20개/30개)
   - 해설 포함 여부 선택
3. **문제 생성**: "문제지 생성" 버튼 클릭
4. **미리보기**: 생성된 문제 확인
5. **다운로드**: PDF 또는 Word 형식으로 다운로드
6. **기록 확인**: `/history` 페이지에서 과거 생성 기록 확인

## 🎨 코딩 컨벤션

- **들여쓰기**: 2칸 스페이스
- **변수/함수명**: camelCase
- **상수**: SNAKE_CASE  
- **파일명**: kebab-case
- **enum 클래스 변수**: snake_case
- **주석**: 한글로 작성, 필요한 부분에만 최소한으로 작성 (why 중심)

## 🔧 주요 기능

### 메인 페이지
- 서비스 소개 및 주요 기능 안내
- 실시간 통계 (생성된 문제지, 만족한 사용자, 만족도)
- 빠른 문제지 생성 폼

### 문제지 생성 페이지 (`/create`)
- 상세한 설정 옵션
- 실시간 미리보기
- 다중 형식 다운로드

### 생성 기록 페이지 (`/history`)
- 과거 생성한 문제지 목록
- 재다운로드 기능
- 검색 및 필터링

### 로그인 시스템 (`/login`)
- 사용자 인증
- 개인화된 서비스 제공

## 💡 향후 계획

- [ ] AI 모델 통합 및 실제 문제 생성 API 개발
- [ ] 사용자 계정 시스템 구축
- [ ] 실시간 문제지 생성 기능
- [ ] 개인 맞춤형 학습 분석 기능
- [ ] 모바일 앱 개발
- [ ] 다양한 과목 확장 (과학, 사회 등)
- [ ] 협업 기능 (선생님-학생 연결)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### PR 규칙
- description에 해결한 문제, 변경 사항, 테스트 내용 포함
- 코딩 컨벤션 준수
- API 변경 시 문서 업데이트

## 🐛 버그 리포트 및 기능 요청

버그 리포트나 새로운 기능 요청은 [Issues](https://github.com/your-username/ai-learning/issues)를 통해 등록해 주세요.

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트 관련 문의나 버그 리포트는 Issues를 통해 연락주세요. 