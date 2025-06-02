"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = () => {
    setIsLoading(true)
    // 실제 구현에서는 여기에 구글 OAuth 로직이 들어갑니다
    setTimeout(() => {
      setIsLoading(false)
      // 로그인 성공 후 홈으로 리디렉션
      window.location.href = "/"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 flex flex-col">
      <div className="container mx-auto px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <Card className="w-full max-w-md border-none shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">AI 문제지 생성기 로그인</CardTitle>
            <CardDescription>로그인하여 맞춤형 문제지를 생성하고 저장된 문제지를 관리하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-medium">AI 문제지 생성기</span>에 로그인하면 다음과 같은 혜택이 있습니다:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc pl-5">
                <li>생성한 문제지 저장 및 관리</li>
                <li>맞춤형 설정 저장</li>
                <li>문제지 생성 히스토리 확인</li>
                <li>프리미엄 기능 이용 가능</li>
              </ul>
            </div>

            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 flex items-center justify-center gap-3 relative"
              variant="outline"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span className="font-medium">{isLoading ? "로그인 중..." : "Google로 로그인"}</span>
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500">
            로그인함으로써{" "}
            <Link href="#" className="text-blue-600 hover:underline">
              서비스 약관
            </Link>
            과{" "}
            <Link href="#" className="text-blue-600 hover:underline">
              개인정보 처리방침
            </Link>
            에 동의합니다.
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
