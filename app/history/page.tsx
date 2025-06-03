"use client"

import { useState } from "react"
import { Calendar, Download, FileText, Clock, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Header from "@/components/header"

// 샘플 데이터
const testPaperHistory = [
  {
    id: 1,
    title: "3학년 수학 - 곱셈과 나눗셈",
    subject: "수학",
    grade: "3학년",
    questionCount: 20,
    difficulty: "보통",
    createdAt: "2024-01-15",
    time: "14:30",
    status: "완료",
  },
  {
    id: 2,
    title: "5학년 영어 - 기본 문법",
    subject: "영어",
    grade: "5학년",
    questionCount: 15,
    difficulty: "쉬움",
    createdAt: "2024-01-14",
    time: "10:15",
    status: "완료",
  },
  {
    id: 3,
    title: "4학년 국어 - 독해와 어휘",
    subject: "국어",
    grade: "4학년",
    questionCount: 25,
    difficulty: "어려움",
    createdAt: "2024-01-13",
    time: "16:45",
    status: "완료",
  },
  {
    id: 4,
    title: "2학년 수학 - 덧셈과 뺄셈",
    subject: "수학",
    grade: "2학년",
    questionCount: 10,
    difficulty: "쉬움",
    createdAt: "2024-01-12",
    time: "09:20",
    status: "완료",
  },
  {
    id: 5,
    title: "6학년 수학 - 분수와 소수",
    subject: "수학",
    grade: "6학년",
    questionCount: 30,
    difficulty: "어려움",
    createdAt: "2024-01-11",
    time: "13:10",
    status: "완료",
  },
  {
    id: 6,
    title: "3학년 영어 - 기초 단어",
    subject: "영어",
    grade: "3학년",
    questionCount: 12,
    difficulty: "보통",
    createdAt: "2024-01-10",
    time: "11:30",
    status: "생성중",
  },
]

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedGrade, setSelectedGrade] = useState("all")

  const filteredHistory = testPaperHistory.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === "all" || item.subject === selectedSubject
    const matchesGrade = selectedGrade === "all" || item.grade === selectedGrade
    return matchesSearch && matchesSubject && matchesGrade
  })

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "수학":
        return "bg-blue-100 text-blue-800"
      case "국어":
        return "bg-rose-100 text-rose-800"
      case "영어":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움":
        return "bg-green-100 text-green-800"
      case "보통":
        return "bg-yellow-100 text-yellow-800"
      case "어려움":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDownload = (id: number, format: "pdf" | "word") => {
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">생성 기록</h1>
          <p className="text-gray-600">지금까지 생성한 문제지를 확인하고 다운로드하세요.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 생성 문제지</p>
                  <p className="text-2xl font-bold text-gray-900">{testPaperHistory.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">이번 주 생성</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 문제 수</p>
                  <p className="text-2xl font-bold text-gray-900">132</p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">Q</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">평균 소요 시간</p>
                  <p className="text-2xl font-bold text-gray-900">2분</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              필터 및 검색
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="문제지 제목 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="과목 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 과목</SelectItem>
                  <SelectItem value="수학">수학</SelectItem>
                  <SelectItem value="국어">국어</SelectItem>
                  <SelectItem value="영어">영어</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="학년 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 학년</SelectItem>
                  <SelectItem value="1학년">1학년</SelectItem>
                  <SelectItem value="2학년">2학년</SelectItem>
                  <SelectItem value="3학년">3학년</SelectItem>
                  <SelectItem value="4학년">4학년</SelectItem>
                  <SelectItem value="5학년">5학년</SelectItem>
                  <SelectItem value="6학년">6학년</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full">
                필터 초기화
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>문제지 생성 기록</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>문제지 제목</TableHead>
                  <TableHead>과목</TableHead>
                  <TableHead>학년</TableHead>
                  <TableHead>문제 수</TableHead>
                  <TableHead>난이도</TableHead>
                  <TableHead>생성 일시</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>다운로드</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge className={getSubjectColor(item.subject)}>{item.subject}</Badge>
                    </TableCell>
                    <TableCell>{item.grade}</TableCell>
                    <TableCell>{item.questionCount}개</TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(item.difficulty)}>{item.difficulty}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{item.createdAt}</div>
                        <div className="text-gray-500">{item.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === "완료" ? "default" : "secondary"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.status === "완료" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(item.id, "pdf")}
                            className="text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(item.id, "word")}
                            className="text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            WORD
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">생성중...</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-500">다른 검색 조건을 시도해보세요.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
