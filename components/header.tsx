import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, Sparkles } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-500 to-indigo-700 shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4 text-white">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
            AI 문제지 생성기
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-purple-200 transition-all duration-300 font-medium relative group">
            홈
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/create" className="hover:text-purple-200 transition-all duration-300 font-medium relative group">
            문제지 만들기
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/history"
            className="hover:text-purple-200 transition-all duration-300 font-medium relative group"
          >
            생성 기록
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/login">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-purple-700 hover:bg-gray-100 border-none font-medium"
            >
              <LogIn className="mr-2 h-4 w-4" />
              로그인
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
