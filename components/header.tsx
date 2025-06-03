"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogIn, Sparkles, LogOut, User, Menu, X } from "lucide-react"

interface UserInfo {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkAuthStatus();
    
    // localStorage 변경 감지 (다른 탭에서 변경된 경우만)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /**
   * localStorage에서 사용자 정보 확인
   */
  const checkAuthStatus = () => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('access_token');
    
    if (savedUser && savedToken) {
      try {
        let userData = JSON.parse(savedUser);
        
        // wrapper 객체인지 확인 (success, user, message 필드가 있는 경우)
        if (userData.success && userData.user) {
          userData = userData.user;
          // localStorage를 올바른 형태로 다시 저장
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        // 기존 사용자와 다른 경우에만 업데이트 (JSON 문자열로 비교하여 정확한 비교)
        const currentUserJson = JSON.stringify(user);
        const newUserJson = JSON.stringify(userData);
        
        if (currentUserJson !== newUserJson) {
          setUser(userData);
          setImageLoadError(false); // 사용자 변경 시 이미지 에러 상태 초기화
        }
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        setUser(null);
      }
    } else {
      // 토큰이나 사용자 정보가 없으면 로그아웃 상태
      if (user) {
        setUser(null);
      }
    }
  };

  const handleLoginClick = () => {
    setIsMobileMenuOpen(false);
    router.push('/login');
  };

  /**
   * 로그아웃 처리
   */
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const currentOrigin = window.location.origin;
      
      // 백엔드 로그아웃 API 호출
      if (token) {
        await fetch(`${currentOrigin}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('로그아웃 API 오류:', error);
    } finally {
      // 로컬 스토리지 정리
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setUser(null);
      setIsMobileMenuOpen(false);
      // 홈페이지로 리디렉션
      router.push('/');
    }
  };

  // 로그인 성공 후 상태 업데이트를 위한 이벤트 리스너 (같은 탭에서의 변경 감지)
  useEffect(() => {
    const handleUserUpdate = () => {
      checkAuthStatus();
    };

    // 커스텀 이벤트로 로그인 성공을 알림받기
    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  // 이미지 로드 에러 핸들러
  const handleImageError = () => {
    console.error('프로필 이미지 로드 실패:', user?.profileImage);
    setImageLoadError(true);
  };

  // 이미지 로드 성공 핸들러
  const handleImageLoad = () => {
    setImageLoadError(false);
  };

  // 모바일 메뉴 닫기
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-purple-500 to-indigo-700 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 text-white relative z-50">
        <Link href="/" className="flex items-center gap-2 sm:gap-3" onClick={closeMobileMenu}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
            AI 문제지 생성기
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
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
          
          {/* 로그인 상태에 따른 조건부 렌더링 */}
          {!user ? (
            // 로그인 전 - 로그인 버튼
            <div 
              onClick={handleLoginClick}
              className="cursor-pointer relative z-10 pointer-events-auto"
              onMouseEnter={() => console.log('로그인 버튼 영역에 마우스 진입')}
              style={{ pointerEvents: 'auto' }}
            >
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-purple-700 hover:bg-gray-100 border-none font-medium cursor-pointer relative z-10 pointer-events-auto"
                style={{ pointerEvents: 'auto' }}
              >
                <LogIn className="mr-2 h-4 w-4" />
                로그인
              </Button>
            </div>
          ) : (
            // 로그인 후 - 사용자 프로필 (이미지만)
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar className="w-8 h-8">
                    {user.profileImage && !imageLoadError ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <AvatarFallback className="bg-white text-purple-700 text-xs font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="font-medium">{user.name || '이름 없음'}</div>
                  <div className="text-sm text-gray-500">{user.email || '이메일 없음'}</div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile User Avatar (로그인 상태일 때만) */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar className="w-8 h-8">
                    {user.profileImage && !imageLoadError ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <AvatarFallback className="bg-white text-purple-700 text-xs font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="font-medium">{user.name || '이름 없음'}</div>
                  <div className="text-sm text-gray-500">{user.email || '이메일 없음'}</div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-purple-500 to-indigo-700 border-t border-white/20 z-50">
            <div className="flex flex-col space-y-1 p-4">
              <Link 
                href="/" 
                className="block py-3 px-4 hover:bg-white/10 rounded-lg transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                홈
              </Link>
              <Link 
                href="/create" 
                className="block py-3 px-4 hover:bg-white/10 rounded-lg transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                문제지 만들기
              </Link>
              <Link 
                href="/history" 
                className="block py-3 px-4 hover:bg-white/10 rounded-lg transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                생성 기록
              </Link>
              
              {/* 로그인 버튼 (로그인되지 않은 경우만) */}
              {!user && (
                <div className="pt-2 border-t border-white/20 mt-2">
                  <Button
                    onClick={handleLoginClick}
                    className="w-full bg-white text-purple-700 hover:bg-gray-100 font-medium"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
