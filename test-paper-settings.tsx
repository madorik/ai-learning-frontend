"use client"

import { useState } from "react"
import { Check, FileText, BookOpen, Save, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TestPaperSettings() {
  const [activeGrade, setActiveGrade] = useState("3")
  const [activeQuestionCount, setActiveQuestionCount] = useState("10")
  const [activeDifficulty, setActiveDifficulty] = useState("normal")
  const [activeSubject, setActiveSubject] = useState("math")
  const [includeExplanation, setIncludeExplanation] = useState(false)
  const [timeLimit, setTimeLimit] = useState("15")

  const subjects = [
    {
      id: "math",
      name: "수학",
      icon: <div className="w-5 h-5 flex items-center justify-center text-primary font-bold">∑</div>,
    },
    {
      id: "korean",
      name: "국어",
      icon: <div className="w-5 h-5 flex items-center justify-center text-rose-500 font-bold">가</div>,
    },
    {
      id: "english",
      name: "영어",
      icon: <div className="w-5 h-5 flex items-center justify-center text-sky-500 font-bold">A</div>,
    },
  ]

  const grades = ["1", "2", "3", "4", "5", "6"]
  const questionCounts = ["5", "10", "20", "30"]
  const difficulties = [
    { id: "easy", name: "쉬움" },
    { id: "normal", name: "보통" },
    { id: "hard", name: "어려움" },
  ]

  const selectedSubjects = [
    { grade: "3", subject: "수학", chapter: "기본" },
    { grade: "5", subject: "영어", chapter: "실생" },
  ]

  return (
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
            {/* 저장된 설정 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">저장된 설정</h3>
              </div>
              <Card className="border border-muted bg-muted/10">
                <CardContent className="p-3">
                  <Accordion type="single" collapsible className="w-full">
                    {selectedSubjects.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="py-2 hover:no-underline">
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="font-normal">
                              {item.grade}학년
                            </Badge>
                            <span>{item.subject}</span>
                            <span className="text-muted-foreground">{item.chapter}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex justify-between py-1">
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              적용
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive">
                              삭제
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

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

            {/* 추천 단원 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">추천 단원</h3>
              <Select defaultValue="당분과 별생곱셈">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="단원 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="당분과 별생곱셈">당분과 별생곱셈</SelectItem>
                  <SelectItem value="분수와 소수">분수와 소수</SelectItem>
                  <SelectItem value="도형의 기초">도형의 기초</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 버튼 */}
            <div className="flex flex-col gap-3 pt-2">
              <Button variant="outline" className="w-full gap-2">
                <Save className="h-4 w-4" />
                설정저장
              </Button>
              <Button className="w-full gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Wand2 className="h-4 w-4" />
                문제지 생성
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center">
        <div className="text-center max-w-md p-8 rounded-lg bg-gradient-to-b from-blue-50 to-slate-50">
          <div className="mx-auto bg-blue-100/50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-primary/70" />
          </div>
          <h2 className="text-xl font-medium mb-3">문제지를 생성해 보세요</h2>
          <p className="text-muted-foreground text-sm mb-6">
            왼쪽에서 과목, 학년, 난이도 등을 선택하고 문제 생성 버튼을 클릭하면 맞춤형 문제지가 생성됩니다.
          </p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 justify-center">
              <Check className="h-4 w-4 text-green-500" />
              <span>맞춤형 문제</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="h-4 w-4 text-green-500" />
              <span>단계별 해설</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="h-4 w-4 text-green-500" />
              <span>PDF/Word 다운로드</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
