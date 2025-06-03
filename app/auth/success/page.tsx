"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, CheckCircle, AlertCircle } from 'lucide-react'

// AuthSuccess 컴포넌트를 별도로 분리하여 Suspense로 감싸기
function AuthSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const token = searchParams.get('token')

        if (!token) {
          throw new Error('토큰이 없습니다.')
        }

        console.log('=== 로그인 성공 처리 시작 ===');
        console.log('받은 토큰:', token);

        // 토큰을 localStorage에 저장
        localStorage.setItem('access_token', token)

        // Bearer 토큰으로 사용자 정보 가져오기
        const currentOrigin = window.location.origin // http://localhost:9090
        console.log('프로필 API 요청:', `${currentOrigin}/auth/profile`);
        
        const response = await fetch(`${currentOrigin}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('프로필 API 응답 상태:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('프로필 API 오류:', errorText);
          throw new Error(`사용자 정보 가져오기 실패: ${response.status}`)
        }

        const responseData = await response.json()
        console.log('=== 백엔드에서 받은 원본 응답 데이터 ===');
        console.log('전체 응답:', responseData);
        console.log('success 필드:', responseData.success);
        console.log('user 필드:', responseData.user);
        console.log('message 필드:', responseData.message);

        // 실제 사용자 정보는 responseData.user 안에 있음
        const userData = responseData.user;
        console.log('=== 추출된 사용자 데이터 ===');
        console.log('사용자 정보:', userData);
        console.log('이름:', userData.name);
        console.log('이메일:', userData.email);
        console.log('프로필 이미지:', userData.profileImage);
        console.log('ID:', userData.id);

        // 사용자 정보만 localStorage에 저장 (wrapper 객체가 아닌 실제 user 데이터만)
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('localStorage에 저장된 사용자 정보:', JSON.stringify(userData));

        // 헤더에 사용자 정보 업데이트 알림
        window.dispatchEvent(new Event('userUpdated'));

        setStatus('success')
        setMessage(`${userData.name || userData.email || '사용자'}님, 로그인에 성공했습니다!`)

        // 2초 후 홈페이지로 리디렉션
        setTimeout(() => {
          router.push('/')
        }, 2000)

      } catch (error) {
        console.error('로그인 처리 오류:', error)
        setStatus('error')
        setMessage('로그인 처리 중 오류가 발생했습니다.')

        // 로컬 스토리지 정리
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')

        // 3초 후 로그인 페이지로 리디렉션
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    }

    handleAuthSuccess()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AI 문제지 생성기</h1>
        </div>

        {/* 상태 카드 */}
        <Card className="w-full bg-white/95 backdrop-blur-lg shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              {status === 'loading' && (
                <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="w-8 h-8 text-green-500" />
              )}
              {status === 'error' && (
                <AlertCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              {status === 'loading' && '로그인 처리 중...'}
              {status === 'success' && '로그인 성공!'}
              {status === 'error' && '로그인 실패'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{message}</p>
            
            {status === 'loading' && (
              <div className="text-sm text-gray-500">
                사용자 정보를 가져오고 있습니다...
              </div>
            )}
            
            {status === 'success' && (
              <div className="text-sm text-gray-500">
                곧 홈페이지로 이동합니다...
              </div>
            )}
            
            {status === 'error' && (
              <div className="text-sm text-gray-500">
                로그인 페이지로 이동합니다...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 로딩 컴포넌트
function AuthSuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AI 문제지 생성기</h1>
        </div>

        <Card className="w-full bg-white/95 backdrop-blur-lg shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              페이지 로딩 중...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">잠시만 기다려 주세요.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 메인 페이지 컴포넌트
export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<AuthSuccessLoading />}>
      <AuthSuccessContent />
    </Suspense>
  )
} 