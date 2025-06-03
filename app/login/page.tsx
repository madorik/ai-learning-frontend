"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"
import SimpleLogin from "@/components/simple-login"

export default function LoginPage() {
  // 로그인 성공 처리
  const handleLoginSuccess = (user: any) => {
    // 홈페이지로 리디렉션
    window.location.href = '/';
  };

  // 로그인 오류 처리
  const handleLoginError = (error: string) => {
    console.error('로그인 오류:', error);
    alert(`로그인 오류: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 flex flex-col">
      {/* 상단 네비게이션 */}
      <div className="container mx-auto px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Link>
      </div>

      {/* 로그인 영역 */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* 로고 및 제목 */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">AI 문제지 생성기</h1>
            <p className="text-purple-100">로그인하여 맞춤형 문제지를 생성하세요</p>
          </div>

          {/* 로그인 컴포넌트 */}
          <SimpleLogin 
            onLoginSuccess={handleLoginSuccess}
            onLoginError={handleLoginError}
          />

          {/* 하단 약관 */}
          <div className="text-center text-sm text-purple-200 mt-6">
            로그인함으로써{" "}
            <Link href="#" className="text-white hover:underline">
              서비스 약관
            </Link>
            과{" "}
            <Link href="#" className="text-white hover:underline">
              개인정보 처리방침
            </Link>
            에 동의합니다.
          </div>
        </div>
      </div>
    </div>
  )
}
