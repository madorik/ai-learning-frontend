import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Target, MousePointer, FileDown, Award, ArrowRight, Calculator, Languages, BookOpen } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="text-white space-y-6 max-w-xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                AI 기반 맞춤형 학습
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                  AI의 창의적인
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                  문제지
                </span>
              </h1>

              <p className="text-xl text-purple-100 leading-relaxed">초등학생을 위한 맞춤형 문제지 생성 서비스</p>
            </div>

            <p className="text-lg text-purple-100 leading-relaxed">
              인공지능이 학년별, 과목별로 최적화된 문제를 생성합니다. PDF와 Word 형식으로 다운받아 언제든 학습하세요!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
                >
                  문제지 만들기 시작
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white bg-transparent hover:bg-white hover:text-purple-700 px-8 py-4 text-lg rounded-2xl transition-all duration-300"
              >
                데모 보기
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1,000+</div>
                <div className="text-purple-200 text-sm">생성된 문제지</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-purple-200 text-sm">만족한 선생님</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-purple-200 text-sm">만족도</div>
              </div>
            </div>
          </div>

          {/* Right Content - Test Paper Form */}
          <div className="w-full max-w-md">
            <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-0 w-full">
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div className="text-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">문제지 생성하기</h3>
                    <p className="text-gray-600 text-sm mt-1">원하는 과목과 조건을 선택하세요.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">과목 선택</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-blue-500 text-white rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer">
                          <Calculator className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">수학</span>
                        </div>
                        <div className="bg-gray-100 text-gray-600 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer">
                          <BookOpen className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">국어</span>
                        </div>
                        <div className="bg-gray-100 text-gray-600 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer">
                          <Languages className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">영어</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">학년 선택</label>
                        <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                          <option>3학년</option>
                          <option>1학년</option>
                          <option>2학년</option>
                          <option>4학년</option>
                          <option>5학년</option>
                          <option>6학년</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">문제 유형</label>
                        <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                          <option>교과과정 기반</option>
                          <option>수행평가</option>
                          <option>모의고사</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">문제 수 설정</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-gray-100 text-gray-600 rounded-lg p-2 text-center cursor-pointer text-sm">
                          10개
                        </div>
                        <div className="bg-blue-500 text-white rounded-lg p-2 text-center cursor-pointer text-sm">
                          20개
                        </div>
                        <div className="bg-gray-100 text-gray-600 rounded-lg p-2 text-center cursor-pointer text-sm">
                          30개
                        </div>
                      </div>
                    </div>

                    <Link href="/create" className="block mt-2">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2 rounded-lg font-medium text-base">
                        🔥 문제지 생성하기
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">왜 AI 문제지 생성기를 선택해야 할까요?</h2>
            <p className="text-purple-100 text-lg">혁신적인 AI 기술로 더 나은 학습 경험을 제공합니다</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">맞춤형 생성</h3>
                <p className="text-purple-100 text-sm">학년별, 과목별로 최적화된 문제 자동 생성</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MousePointer className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">간편한 제작</h3>
                <p className="text-purple-100 text-sm">클릭 몇 번으로 완성되는 원클릭 문제지 제작</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileDown className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">다양한 형식</h3>
                <p className="text-purple-100 text-sm">PDF, Word 등 다양한 형식으로 다운로드 지원</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">상세한 해설</h3>
                <p className="text-purple-100 text-sm">이해하기 쉬운 단계별 해설 포함 옵션</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
