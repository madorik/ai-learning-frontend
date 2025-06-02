"use client"

import { useState } from "react"
import { FileText, BookOpen, Wand2, Calculator, Languages, ArrowLeft, LogIn, Loader2, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

export default function CreateTestPaperPage() {
  const [activeGrade, setActiveGrade] = useState("3")
  const [activeQuestionCount, setActiveQuestionCount] = useState("10")
  const [activeDifficulty, setActiveDifficulty] = useState("normal")
  const [activeSubject, setActiveSubject] = useState("math")
  const [includeExplanation, setIncludeExplanation] = useState(false)
  const [timeLimit, setTimeLimit] = useState("15")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const [isGenerated, setIsGenerated] = useState(false)

  const subjects = [
    {
      id: "math",
      name: "수학",
      icon: <Calculator className="w-5 h-5 text-primary" />,
    },
    {
      id: "korean",
      name: "국어",
      icon: <BookOpen className="w-5 h-5 text-rose-500" />,
    },
    {
      id: "english",
      name: "영어",
      icon: <Languages className="w-5 h-5 text-sky-500" />,
    },
  ]

  const grades = ["1", "2", "3", "4", "5", "6"]
  const questionCounts = ["5", "10", "20", "30"]
  const difficulties = [
    { id: "easy", name: "쉬움" },
    { id: "normal", name: "보통" },
    { id: "hard", name: "어려움" },
  ]

  // 다운로드 함수
  const handleDownload = (format: "pdf" | "word") => {
    if (!isGenerated) return
    console.log(`Downloading ${format} format`)
    // 실제 구현에서는 여기에 다운로드 API 호출이 들어갈 것입니다
  }

  // 문제지 생성 시작 함수
  const handleGenerateTestPaper = () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setPreviewContent("")
    setIsGenerated(false)

    // 실제 구현에서는 여기에 API 호출 또는 WebSocket 연결이 들어갈 것입니다
    // 여기서는 시뮬레이션을 위해 타이머를 사용합니다
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const newProgress = prev + 5

        // 진행 상황에 따라 미리보기 콘텐츠 업데이트
        updatePreviewContent(newProgress)

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsGenerating(false)
            setIsGenerated(true)
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 300)
  }

  // 진행 상황에 따라 미리보기 콘텐츠 업데이트
  const updatePreviewContent = (progress: number) => {
    const subjectName = subjects.find((s) => s.id === activeSubject)?.name || "수학"
    const difficultyName = difficulties.find((d) => d.id === activeDifficulty)?.name || "보통"

    if (progress < 20) {
      setPreviewContent(`
        <div class="p-4">
          <h2 class="text-xl font-bold mb-4">${activeGrade}학년 ${subjectName} 문제지 생성 중...</h2>
          <p>난이도: ${difficultyName}</p>
          <p>문제 수: ${activeQuestionCount}개</p>
          <p class="mt-4">문제 유형 분석 중...</p>
        </div>
      `)
    } else if (progress < 40) {
      setPreviewContent(`
        <div class="p-4">
          <h2 class="text-xl font-bold mb-4">${activeGrade}학년 ${subjectName} 문제지</h2>
          <p>난이도: ${difficultyName}</p>
          <p>문제 수: ${activeQuestionCount}개</p>
          <div class="mt-4">
            <p class="font-semibold">문제 유형 분석 완료:</p>
            <ul class="list-disc pl-5 mt-2">
              <li>계산 문제: ${Math.floor(Number.parseInt(activeQuestionCount) * 0.4)}개</li>
              <li>서술형 문제: ${Math.floor(Number.parseInt(activeQuestionCount) * 0.3)}개</li>
              <li>그래프 해석: ${Math.floor(Number.parseInt(activeQuestionCount) * 0.3)}개</li>
            </ul>
            <p class="mt-4">문제 생성 중...</p>
          </div>
        </div>
      `)
    } else if (progress < 70) {
      // 문제 일부 생성
      const questionCount = Number.parseInt(activeQuestionCount)
      const generatedCount = Math.floor(((progress - 40) / 30) * questionCount)

      let questionsHtml = ""
      for (let i = 1; i <= generatedCount; i++) {
        if (activeSubject === "math") {
          questionsHtml += `
            <div class="mb-6 p-3 border rounded-lg">
              <p class="font-semibold">문제 ${i}.</p>
              <p>다음 수식을 계산하시오: ${Math.floor(Math.random() * 10) + 1} × ${Math.floor(Math.random() * 10) + 1} + ${Math.floor(Math.random() * 20) + 1}</p>
              <div class="mt-2 flex gap-4">
                <div class="flex items-center">
                  <input type="radio" id="q${i}_1" name="q${i}" class="mr-1">
                  <label for="q${i}_1">${Math.floor(Math.random() * 50) + 10}</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_2" name="q${i}" class="mr-1">
                  <label for="q${i}_2">${Math.floor(Math.random() * 50) + 10}</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_3" name="q${i}" class="mr-1">
                  <label for="q${i}_3">${Math.floor(Math.random() * 50) + 10}</label>
                </div>
              </div>
            </div>
          `
        } else if (activeSubject === "korean") {
          questionsHtml += `
            <div class="mb-6 p-3 border rounded-lg">
              <p class="font-semibold">문제 ${i}.</p>
              <p>다음 중 맞춤법이 올바른 것은?</p>
              <div class="mt-2 flex flex-col gap-2">
                <div class="flex items-center">
                  <input type="radio" id="q${i}_1" name="q${i}" class="mr-1">
                  <label for="q${i}_1">됫다 / 됐다 / 되었다</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_2" name="q${i}" class="mr-1">
                  <label for="q${i}_2">깨끗히 / 깨끗이 / 깨끗하게</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_3" name="q${i}" class="mr-1">
                  <label for="q${i}_3">가르키다 / 가리키다 / 가르치다</label>
                </div>
              </div>
            </div>
          `
        } else {
          questionsHtml += `
            <div class="mb-6 p-3 border rounded-lg">
              <p class="font-semibold">문제 ${i}.</p>
              <p>다음 영어 문장의 올바른 해석은?</p>
              <p class="italic">"The weather is nice today."</p>
              <div class="mt-2 flex flex-col gap-2">
                <div class="flex items-center">
                  <input type="radio" id="q${i}_1" name="q${i}" class="mr-1">
                  <label for="q${i}_1">오늘 날씨가 좋다.</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_2" name="q${i}" class="mr-1">
                  <label for="q${i}_2">어제 날씨가 좋았다.</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_3" name="q${i}" class="mr-1">
                  <label for="q${i}_3">내일 날씨가 좋을 것이다.</label>
                </div>
              </div>
            </div>
          `
        }
      }

      setPreviewContent(`
        <div class="p-4">
          <h2 class="text-xl font-bold mb-4">${activeGrade}학년 ${subjectName} 문제지</h2>
          <p>난이도: ${difficultyName}</p>
          <p>문제 수: ${activeQuestionCount}개</p>
          <p class="mt-4 mb-6">문제 생성 중... (${generatedCount}/${activeQuestionCount})</p>
          ${questionsHtml}
        </div>
      `)
    } else {
      // 모든 문제 생성 완료
      const questionCount = Number.parseInt(activeQuestionCount)

      let questionsHtml = ""
      for (let i = 1; i <= questionCount; i++) {
        if (activeSubject === "math") {
          questionsHtml += `
            <div class="mb-6 p-3 border rounded-lg">
              <p class="font-semibold">문제 ${i}.</p>
              <p>다음 수식을 계산하시오: ${Math.floor(Math.random() * 10) + 1} × ${Math.floor(Math.random() * 10) + 1} + ${Math.floor(Math.random() * 20) + 1}</p>
              <div class="mt-2 flex gap-4">
                <div class="flex items-center">
                  <input type="radio" id="q${i}_1" name="q${i}" class="mr-1">
                  <label for="q${i}_1">${Math.floor(Math.random() * 50) + 10}</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_2" name="q${i}" class="mr-1">
                  <label for="q${i}_2">${Math.floor(Math.random() * 50) + 10}</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_3" name="q${i}" class="mr-1">
                  <label for="q${i}_3">${Math.floor(Math.random() * 50) + 10}</label>
                </div>
              </div>
              ${
                includeExplanation
                  ? `
                <div class="mt-3 pt-2 border-t">
                  <p class="text-sm text-gray-600 font-medium">해설:</p>
                  <p class="text-sm text-gray-600">곱셈을 먼저 계산한 후 덧셈을 합니다.</p>
                </div>
              `
                  : ""
              }
            </div>
          `
        } else if (activeSubject === "korean") {
          questionsHtml += `
            <div class="mb-6 p-3 border rounded-lg">
              <p class="font-semibold">문제 ${i}.</p>
              <p>다음 중 맞춤법이 올바른 것은?</p>
              <div class="mt-2 flex flex-col gap-2">
                <div class="flex items-center">
                  <input type="radio" id="q${i}_1" name="q${i}" class="mr-1">
                  <label for="q${i}_1">됫다 / 됐다 / 되었다</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_2" name="q${i}" class="mr-1">
                  <label for="q${i}_2">깨끗히 / 깨끗이 / 깨끗하게</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_3" name="q${i}" class="mr-1">
                  <label for="q${i}_3">가르키다 / 가리키다 / 가르치다</label>
                </div>
              </div>
              ${
                includeExplanation
                  ? `
                <div class="mt-3 pt-2 border-t">
                  <p class="text-sm text-gray-600 font-medium">해설:</p>
                  <p class="text-sm text-gray-600">'됐다'는 '되었다'의 준말로 맞는 표현입니다.</p>
                </div>
              `
                  : ""
              }
            </div>
          `
        } else {
          questionsHtml += `
            <div class="mb-6 p-3 border rounded-lg">
              <p class="font-semibold">문제 ${i}.</p>
              <p>다음 영어 문장의 올바른 해석은?</p>
              <p class="italic">"The weather is nice today."</p>
              <div class="mt-2 flex flex-col gap-2">
                <div class="flex items-center">
                  <input type="radio" id="q${i}_1" name="q${i}" class="mr-1">
                  <label for="q${i}_1">오늘 날씨가 좋다.</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_2" name="q${i}" class="mr-1">
                  <label for="q${i}_2">어제 날씨가 좋았다.</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="q${i}_3" name="q${i}" class="mr-1">
                  <label for="q${i}_3">내일 날씨가 좋을 것이다.</label>
                </div>
              </div>
              ${
                includeExplanation
                  ? `
                <div class="mt-3 pt-2 border-t">
                  <p class="text-sm text-gray-600 font-medium">해설:</p>
                  <p class="text-sm text-gray-600">'is'는 현재시제이므로 '오늘 날씨가 좋다'가 정답입니다.</p>
                </div>
              `
                  : ""
              }
            </div>
          `
        }
      }

      setPreviewContent(`
        <div class="p-4">
          <h2 class="text-xl font-bold mb-4">${activeGrade}학년 ${subjectName} 문제지</h2>
          <p>난이도: ${difficultyName}</p>
          <p>문제 수: ${activeQuestionCount}개</p>
          <p class="mt-4 mb-6 text-green-600 font-medium">문제 생성 완료!</p>
          ${questionsHtml}
        </div>
      `)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-800">AI 문제지 생성기</span>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/" className="text-gray-600 hover:text-purple-600 transition-colors">
                홈
              </Link>
              <Link href="/create" className="text-purple-600 font-medium">
                문제지 만들기
              </Link>
              <Link href="/history" className="text-gray-600 hover:text-purple-600 transition-colors">
                생성 기록
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  <LogIn className="mr-2 h-4 w-4" />
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">문제지 만들기</h1>
          <p className="text-gray-600">원하는 조건을 설정하고 맞춤형 문제지를 생성해보세요.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-medium">문제지 설정</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                {/* 과목 */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">과목</h3>
                  <div className="flex gap-2">
                    {subjects.map((subject) => (
                      <Button
                        key={subject.id}
                        variant={activeSubject === subject.id ? "default" : "outline"}
                        className={cn("flex-1 gap-2", activeSubject === subject.id ? "" : "text-muted-foreground")}
                        onClick={() => setActiveSubject(subject.id)}
                      >
                        {subject.icon}
                        {subject.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 학년 */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">학년</h3>
                  <div className="flex flex-wrap gap-2">
                    {grades.map((grade) => (
                      <Button
                        key={grade}
                        variant={activeGrade === grade ? "default" : "outline"}
                        className={cn("flex-1 min-w-[60px]", activeGrade === grade ? "" : "text-muted-foreground")}
                        onClick={() => setActiveGrade(grade)}
                      >
                        {grade}학년
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 문제 유형 */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">문제 유형</h3>
                  <Select defaultValue="교과과정">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="문제 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>유형</SelectLabel>
                        <SelectItem value="교과과정">교과과정</SelectItem>
                        <SelectItem value="수행평가">수행평가</SelectItem>
                        <SelectItem value="모의고사">모의고사</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* 문제 수 */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">문제 수</h3>
                  <div className="flex gap-2">
                    {questionCounts.map((count) => (
                      <Button
                        key={count}
                        variant={activeQuestionCount === count ? "default" : "outline"}
                        className={cn("flex-1", activeQuestionCount === count ? "" : "text-muted-foreground")}
                        onClick={() => setActiveQuestionCount(count)}
                      >
                        {count}개
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 난이도 */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">난이도</h3>
                  <Tabs
                    defaultValue="normal"
                    value={activeDifficulty}
                    onValueChange={setActiveDifficulty}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 w-full">
                      {difficulties.map((difficulty) => (
                        <TabsTrigger key={difficulty.id} value={difficulty.id}>
                          {difficulty.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                {/* 해설 포함 */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="explanation"
                    checked={includeExplanation}
                    onCheckedChange={(checked) => setIncludeExplanation(checked as boolean)}
                  />
                  <label
                    htmlFor="explanation"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    해설 포함
                  </label>
                </div>

                {/* 예상 풀이 시간 */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">예상 풀이 시간</h3>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      className="w-20 text-center"
                    />
                    <span className="ml-2 text-sm text-muted-foreground">분</span>
                  </div>
                </div>

                {/* 문제지 생성 버튼 */}
                <div className="pt-2">
                  <Button
                    className="w-full gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    onClick={handleGenerateTestPaper}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        문제지 생성 중... ({generationProgress}%)
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        문제지 생성
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview 영역 */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg font-medium">Preview</CardTitle>
                  {isGenerating && (
                    <div className="flex items-center gap-2 ml-4">
                      <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{generationProgress}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload("pdf")}
                    disabled={!isGenerated}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload("word")}
                    disabled={!isGenerated}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    WORD
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[600px] overflow-auto">
              {previewContent ? (
                <div className="preview-content" dangerouslySetInnerHTML={{ __html: previewContent }} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">미리보기 영역</h3>
                  <p className="text-gray-500 max-w-md mb-4">
                    왼쪽에서 원하는 설정을 선택한 후 '문제지 생성' 버튼을 클릭하면 AI가 실시간으로 문제를 생성하는
                    과정이 여기에 표시됩니다.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md">
                    <p className="text-sm text-blue-700">
                      💡 문제지 생성 완료 후 PDF 또는 WORD 형식으로 다운로드할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
