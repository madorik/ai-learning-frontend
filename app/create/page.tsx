"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileText, BookOpen, Wand2, Calculator, Languages, Loader2, Download, StopCircle, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Header from "@/components/header"
import { downloadAsPDF, downloadAsWord } from "@/lib/download-utils"

interface Problem {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

interface StreamData {
  type: string;
  message?: string;
  content?: string;
  tokenCount?: number;
  data?: {
    problems: Problem[];
  };
  metadata?: {
    model: string;
    usage: {
      estimatedTokens: number;
    };
    timestamp: string;
  };
  error?: string;
}

export default function CreateTestPaperPage() {
  const router = useRouter()
  const [activeGrade, setActiveGrade] = useState("3")
  const [activeQuestionCount, setActiveQuestionCount] = useState("1")
  const [activeDifficulty, setActiveDifficulty] = useState("normal")
  const [activeSubject, setActiveSubject] = useState("math")
  const [activeQuestionType, setActiveQuestionType] = useState("교과과정")
  const [includeExplanation, setIncludeExplanation] = useState(false)
  const [timeLimit, setTimeLimit] = useState("15")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const [isGenerated, setIsGenerated] = useState(false)
  
  // 스트리밍 관련 상태
  const [statusMessages, setStatusMessages] = useState<Array<{type: string, message: string, timestamp: string}>>([])
  const [streamContent, setStreamContent] = useState("")
  const [tokenCount, setTokenCount] = useState(0)
  const [finalResult, setFinalResult] = useState<any>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  // 알림 모달 상태
  const [alertModal, setAlertModal] = useState({
    open: false,
    type: 'info' as 'info' | 'warning' | 'error' | 'success',
    title: '',
    message: '',
    showRedirectButton: false
  })

  const subjects = [
    {
      id: "math",
      name: "수학",
      icon: <Calculator className="w-5 h-5 text-primary" />,
      apiValue: "수학"
    },
    {
      id: "korean",
      name: "국어", 
      icon: <BookOpen className="w-5 h-5 text-rose-500" />,
      apiValue: "국어"
    },
    {
      id: "english",
      name: "영어",
      icon: <Languages className="w-5 h-5 text-sky-500" />,
      apiValue: "영어"
    },
  ]

  const grades = ["1", "2", "3", "4", "5", "6"]
  const questionCounts = ["1", "2", "3", "4"]
  const difficulties = [
    { id: "easy", name: "쉬움", apiValue: "쉬움" },
    { id: "normal", name: "보통", apiValue: "보통" },
    { id: "hard", name: "어려움", apiValue: "어려움" },
  ]

  const questionTypes = ["교과과정", "응용 문제", "기초 개념", "실생활 응용"]

  // 예쁜 알림창 표시 함수
  const showAlert = (type: 'info' | 'warning' | 'error' | 'success', title: string, message: string, showRedirectButton = false) => {
    setAlertModal({
      open: true,
      type,
      title,
      message,
      showRedirectButton
    })
  }

  // 알림창 닫기
  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, open: false }))
  }

  // 로그인 페이지로 이동
  const redirectToLogin = () => {
    closeAlert()
    router.push('/login')
  }

  // 로그인 토큰 체크 함수
  const checkAuthToken = (): boolean => {
    if (typeof window === 'undefined') return false
    
    const token = localStorage.getItem('access_token')
    console.log('토큰 체크:', token ? '토큰 있음' : '토큰 없음')
    
    if (!token) {
      showAlert('warning', '로그인 필요', '로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?', true)
      return false
    }
    
    return true
  }

  // 다운로드 함수 - 실제 구현
  const handleDownload = async (format: "pdf" | "word") => {
    if (!isGenerated || !finalResult?.data?.problems) {
      showAlert('info', '문제지 생성 필요', '먼저 문제지를 생성해주세요.')
      return
    }

    // 로그인 토큰 체크
    if (!checkAuthToken()) {
      return
    }

    try {
      // 과목명 변환
      const subjectName = subjects.find(s => s.id === activeSubject)?.name || "수학"
      const difficultyName = difficulties.find(d => d.id === activeDifficulty)?.name || "보통"

      // 다운로드용 데이터 준비
      const testPaperData = {
        subject: subjectName,
        grade: activeGrade,
        difficulty: difficultyName,
        questionCount: activeQuestionCount,
        questionType: activeQuestionType,
        includeExplanation: includeExplanation,
        problems: finalResult.data.problems
      }

      if (format === "pdf") {
        await downloadAsPDF(testPaperData)
        showAlert('success', '다운로드 준비 완료', 'PDF 인쇄 대화상자가 열렸습니다. 인쇄 또는 PDF로 저장을 선택해주세요.')
      } else if (format === "word") {
        downloadAsWord(testPaperData)
        showAlert('success', '다운로드 완료', 'Word 문서 다운로드가 시작되었습니다.')
      }
    } catch (error) {
      console.error('다운로드 오류:', error)
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      showAlert('error', '다운로드 오류', `다운로드 중 오류가 발생했습니다: ${errorMessage}`)
    }
  }

  // 상태 메시지 추가
  const addStatusMessage = (type: string, message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setStatusMessages(prev => [...prev, { type, message, timestamp }])
  }

  // 스트리밍 중단
  const stopStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    
    setIsGenerating(false)
    // 사용자가 직접 중단한 경우에만 메시지 표시
    if (isGenerating) {
      addStatusMessage('stop', '사용자에 의해 중단되었습니다.')
    }
  }

  // 스트림 데이터 처리
  const handleStreamData = (data: StreamData) => {
    switch (data.type) {
      case 'connected':
        addStatusMessage('connected', data.message || '연결됨')
        break
        
      case 'start':
        addStatusMessage('start', data.message || '생성 시작')
        break
        
      case 'progress':
        addStatusMessage('progress', data.message || '진행 중')
        break
        
      case 'stream_start':
        addStatusMessage('stream', data.message || '스트림 시작')
        setStreamContent("")
        // 빈 문제지 틀 표시
        initializePreviewWithEmptyPaper()
        break
        
      case 'chunk':
        if (data.content) {
          setStreamContent(prev => {
            const newContent = prev + data.content
            // 실시간으로 JSON 파싱 시도하여 완성된 문제들 표시
            parseAndDisplayProblems(newContent)
            return newContent
          })
        }
        if (data.tokenCount) {
          setTokenCount(data.tokenCount)
        }
        break
        
      case 'parsing':
        addStatusMessage('parsing', data.message || '결과 파싱 중')
        break
        
      case 'complete':
        addStatusMessage('complete', '문제 생성이 완료되었습니다!')
        if (data.data) {
          setFinalResult(data)
          displayResult(data)
        }
        setIsGenerating(false)
        setIsGenerated(true)
        // 완료 후 연결 종료하여 재연결 방지
        if (eventSourceRef.current) {
          eventSourceRef.current.close()
          eventSourceRef.current = null
        }
        break
        
      case 'error':
        addStatusMessage('error', `오류: ${data.error}`)
        updatePreviewWithError(data.error || '알 수 없는 오류가 발생했습니다.')
        setIsGenerating(false)
        break
    }
  }

  // 빈 문제지 틀 초기화
  const initializePreviewWithEmptyPaper = () => {
    const subjectName = subjects.find(s => s.id === activeSubject)?.name || "수학"
    const difficultyName = difficulties.find(d => d.id === activeDifficulty)?.name || "보통"
    
    const html = `
      <div class="p-6">
        <div class="border-b pb-4 mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">${activeGrade}학년 ${subjectName} 문제지</h2>
          <div class="flex gap-4 text-sm text-gray-600">
            <span>난이도: ${difficultyName}</span>
            <span>문제 수: ${activeQuestionCount}개</span>
            <span>문제 유형: ${activeQuestionType}</span>
          </div>
        </div>
        
        <div class="text-center py-8 text-gray-500">
          <div class="animate-pulse">문제 생성 중...</div>
        </div>
      </div>
    `
    setPreviewContent(html)
  }

  // 실시간 JSON 파싱 및 문제 표시
  const parseAndDisplayProblems = (content: string) => {
    try {
      // JSON 객체 찾기 시도
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return;
      
      const jsonStr = jsonMatch[0];
      
      // 부분적으로 완성된 JSON 파싱 시도
      let parsedData;
      try {
        parsedData = JSON.parse(jsonStr);
      } catch (e) {
        // JSON이 완전하지 않으면 문제 배열까지만 파싱 시도
        const problemsMatch = content.match(/"problems"\s*:\s*\[([\s\S]*?)\]/);
        if (!problemsMatch) return;
        
        const problemsStr = problemsMatch[1];
        const problems = [];
        
        // 완성된 문제 객체들 찾기
        const problemMatches = problemsStr.match(/\{[^{}]*"question"[^{}]*"choices"[^{}]*"answer"[^{}]*"explanation"[^{}]*\}/g);
        if (problemMatches) {
          for (const problemStr of problemMatches) {
            try {
              const problem = JSON.parse(problemStr);
              if (problem.question && problem.choices && problem.answer && problem.explanation) {
                problems.push(problem);
              }
            } catch (e) {
              continue;
            }
          }
        }
        
        if (problems.length > 0) {
          displayPartialProblems(problems);
        }
        return;
      }
      
      // 완전한 JSON이 파싱된 경우
      if (parsedData.problems && Array.isArray(parsedData.problems)) {
        displayPartialProblems(parsedData.problems.filter(p => 
          p.question && p.choices && p.answer && p.explanation
        ));
      }
    } catch (error) {
      // 파싱 오류는 무시하고 계속 진행
    }
  }

  // 부분 완성된 문제들 표시
  const displayPartialProblems = (problems: Problem[]) => {
    if (problems.length === 0) return;
    
    const subjectName = subjects.find(s => s.id === activeSubject)?.name || "수학"
    const difficultyName = difficulties.find(d => d.id === activeDifficulty)?.name || "보통"

    let html = `
      <div class="p-6">
        <div class="border-b pb-4 mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">${activeGrade}학년 ${subjectName} 문제지</h2>
          <div class="flex gap-4 text-sm text-gray-600">
            <span>난이도: ${difficultyName}</span>
            <span>문제 수: ${activeQuestionCount}개</span>
            <span>문제 유형: ${activeQuestionType}</span>
          </div>
        </div>
    `

    // 완성된 문제들 표시
    problems.forEach((problem, index) => {
      html += `
        <div class="mb-8 p-4 border border-gray-200 rounded-lg bg-white">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">📖 문제 ${index + 1}</h3>
          <div class="text-gray-700 mb-4 leading-relaxed">${problem.question}</div>
          
          <div class="space-y-2 mb-4">
            <strong class="text-gray-800">보기:</strong>
            ${problem.choices.map((choice, idx) => `
              <div class="flex items-center p-2 rounded bg-gray-50">
                <span class="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium mr-3">
                  ${idx + 1}
                </span>
                <span class="text-gray-700">${choice}</span>
              </div>
            `).join('')}
          </div>

          ${includeExplanation ? `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start gap-2">
                <span class="text-blue-600 font-medium">💡 해설:</span>
                <div class="text-blue-700 leading-relaxed">${problem.explanation}</div>
              </div>
            </div>
          ` : ''}
        </div>
      `
    })

    // 아직 생성 중인 문제가 있는 경우
    if (problems.length < parseInt(activeQuestionCount)) {
      const remaining = parseInt(activeQuestionCount) - problems.length;
      html += `
        <div class="mb-8 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div class="text-center py-4 text-gray-500">
            <div class="animate-pulse">
              <div class="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <div>남은 문제 ${remaining}개 생성 중...</div>
            </div>
          </div>
        </div>
      `
    }

    html += '</div>'
    setPreviewContent(html)
  }

  // 결과 표시 함수 (test-streaming.html의 displayResult 참고)
  const displayResult = (data: StreamData) => {
    if (!data.data || !data.data.problems) {
      setPreviewContent('<div class="p-4 text-red-600">결과 데이터가 올바르지 않습니다.</div>')
      return
    }

    const subjectName = subjects.find(s => s.id === activeSubject)?.name || "수학"
    const difficultyName = difficulties.find(d => d.id === activeDifficulty)?.name || "보통"

    let html = `
      <div class="p-6">
   
    `

    // 각 문제 표시
    data.data.problems.forEach((problem, index) => {
      html += `
        <div class="mb-8 p-4 border border-gray-200 rounded-lg bg-white">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">📖 문제 ${index + 1}</h3>
          <div class="text-gray-700 mb-4 leading-relaxed">${problem.question}</div>
          
          <div class="space-y-2 mb-4">
            <strong class="text-gray-800">보기:</strong>
            ${problem.choices.map((choice, idx) => `
              <div class="flex items-center p-2 rounded bg-gray-50">
                <span class="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium mr-3">
                  ${idx + 1}
                </span>
                <span class="text-gray-700">${choice}</span>
              </div>
            `).join('')}
          </div>

          ${includeExplanation ? `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start gap-2">
                <span class="text-blue-600 font-medium">💡 해설:</span>
                <div class="text-blue-700 leading-relaxed">${problem.explanation}</div>
              </div>
            </div>
          ` : ''}
        </div>
      `
    })



    html += '</div>'
    setPreviewContent(html)
  }

  // 문제지 생성 시작 함수 - 토큰 체크 추가
  const handleGenerateTestPaper = () => {
    // 로그인 토큰 체크
    if (!checkAuthToken()) {
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setPreviewContent("")
    setIsGenerated(false)
    setStatusMessages([])
    setStreamContent("")
    setTokenCount(0)
    setFinalResult(null)

    // 폼 데이터 준비
    const subjectValue = subjects.find(s => s.id === activeSubject)?.apiValue || "수학"
    const difficultyValue = difficulties.find(d => d.id === activeDifficulty)?.apiValue || "보통"
    
    const formData = {
      subject: subjectValue,
      grade: activeGrade,
      questionType: activeQuestionType,
      questionCount: activeQuestionCount,
      difficulty: difficultyValue,
      includeExplanation: includeExplanation
    }

    console.log('문제지 생성 요청:', formData)

    // 쿼리 스트링 생성
    const queryParams = new URLSearchParams(formData).toString()
    const url = `${window.location.origin}/api/generate-problems-stream?${queryParams}`

    // EventSource 연결
    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onmessage = function(event) {
      try {
        const data = JSON.parse(event.data)
        handleStreamData(data)
      } catch (error) {
        console.error('데이터 파싱 오류:', error)
        addStatusMessage('error', '데이터 파싱 오류가 발생했습니다.')
        updatePreviewWithError('데이터 파싱 오류가 발생했습니다.')
      }
    }

    eventSource.onerror = function(error) {
      // EventSource의 readyState 확인
      // 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
      if (eventSource.readyState === EventSource.CLOSED) {
        // 정상 종료된 경우 (complete 후 자동 종료 등)
        if (isGenerated || !isGenerating) {
          console.log('SSE 연결이 정상적으로 종료되었습니다.')
          return
        }
      }
      
      // 실제 오류인 경우만 에러 메시지 표시
      if (isGenerating && !isGenerated) {
        addStatusMessage('error', '연결 오류가 발생했습니다.')
        updatePreviewWithError('백엔드 서버 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.')
        stopStreaming()
      }
    }
  }

  // Preview에 오류 표시
  const updatePreviewWithError = (error: string) => {
    const html = `
      <div class="p-6">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm">!</span>
            </div>
            <h3 class="text-lg font-semibold text-red-800">오류 발생</h3>
          </div>
          <p class="text-red-700 mb-4">${error}</p>
          <div class="bg-red-100 border border-red-300 rounded p-3">
            <p class="text-red-800 text-sm">
              💡 잠시 후 다시 시도해주세요. 문제가 계속되면 설정을 변경해보세요.
            </p>
          </div>
        </div>
      </div>
    `
    setPreviewContent(html)
  }

  // 알림 모달 아이콘 선택
  const getAlertIcon = () => {
    switch (alertModal.type) {
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />
      case 'error':
        return <AlertTriangle className="h-6 w-6 text-red-500" />
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      default:
        return <Info className="h-6 w-6 text-blue-500" />
    }
  }

  // 알림 모달 색상 선택
  const getAlertColor = () => {
    switch (alertModal.type) {
      case 'warning':
        return 'text-amber-700'
      case 'error':
        return 'text-red-700'
      case 'success':
        return 'text-green-700'
      default:
        return 'text-blue-700'
    }
  }

  // 페이지 언로드 시 연결 정리
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* 알림 모달 */}
      <Dialog open={alertModal.open} onOpenChange={closeAlert}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {getAlertIcon()}
              <DialogTitle className={getAlertColor()}>{alertModal.title}</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 leading-relaxed">
              {alertModal.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            {alertModal.showRedirectButton ? (
              <>
                <Button variant="outline" onClick={closeAlert}>
                  취소
                </Button>
                <Button onClick={redirectToLogin} className="bg-blue-500 hover:bg-blue-600">
                  로그인 하러 가기
                </Button>
              </>
            ) : (
              <Button onClick={closeAlert} className="w-full">
                확인
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <Select value={activeQuestionType} onValueChange={setActiveQuestionType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="문제 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>유형</SelectLabel>
                        {questionTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
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
                  <div className="flex gap-2">
                    {difficulties.map((difficulty) => (
                      <Button
                        key={difficulty.id}
                        variant={activeDifficulty === difficulty.id ? "default" : "outline"}
                        className={cn(
                          "flex-1",
                          activeDifficulty === difficulty.id ? (
                            difficulty.id === "easy" ? "bg-green-500 hover:bg-green-600 text-white" :
                            difficulty.id === "normal" ? "bg-yellow-500 hover:bg-yellow-600 text-white" :
                            "bg-red-500 hover:bg-red-600 text-white"
                          ) : (
                            difficulty.id === "easy" ? "text-green-600 border-green-200 hover:bg-green-50" :
                            difficulty.id === "normal" ? "text-yellow-600 border-yellow-200 hover:bg-yellow-50" :
                            "text-red-600 border-red-200 hover:bg-red-50"
                          )
                        )}
                        onClick={() => setActiveDifficulty(difficulty.id)}
                      >
                        {difficulty.name}
                      </Button>
                    ))}
                  </div>
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

                {/* 문제지 생성 버튼 */}
                <div className="pt-2 flex gap-2">
                  <Button
                    className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    onClick={handleGenerateTestPaper}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        문제지 생성
                      </>
                    )}
                  </Button>
                  {isGenerating && (
                    <Button
                      variant="outline"
                      onClick={stopStreaming}
                      className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <StopCircle className="h-4 w-4" />
                      중단
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview 영역 */}
          <div className="space-y-4">
            {/* Preview 결과 */}
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg font-medium">Preview</CardTitle>
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
    </div>
  )
}