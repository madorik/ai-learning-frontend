'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface SimpleLoginProps {
  onLoginSuccess?: (user: UserInfo) => void;
  onLoginError?: (error: string) => void;
}

export default function SimpleLogin({ 
  onLoginSuccess, 
  onLoginError 
}: SimpleLoginProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * localStorage에서 사용자 정보 복원
   */
  const checkAuthStatus = () => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('access_token');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    }
  };

  /**
   * 백엔드 로그인 API 호출
   */
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // 현재 프론트엔드 서버(9090포트)의 /auth/google API 호출
      const currentOrigin = window.location.origin; // http://localhost:9090
      
      // /auth/google 엔드포인트로 리디렉션
      window.location.href = `${currentOrigin}/auth/google`;
      
    } catch (error) {
      console.error('로그인 오류:', error);
      const errorMessage = '로그인에 실패했습니다.';
      
      if (onLoginError) {
        onLoginError(errorMessage);
      } else {
        alert(errorMessage);
      }
      setIsLoading(false);
    }
  };

  /**
   * 로그아웃 처리
   */
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const currentOrigin = window.location.origin; // http://localhost:9090
      
      // 프론트엔드 서버의 로그아웃 API 호출
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
      console.log('로그아웃 완료');
    }
  };

  return (
    <Card className="w-full bg-white/95 backdrop-blur-lg shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-gray-800">
          {user ? '로그인 완료' : '로그인'}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {user ? '계정 정보' : '구글 계정으로 간편하게 로그인하세요'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!user ? (
          // 로그인 전 상태
          <Button 
            onClick={handleLogin} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                로그인 중...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                  />
                </svg>
                구글로 로그인
              </div>
            )}
          </Button>
        ) : (
          // 로그인 후 상태
          <div className="space-y-4">
            {/* 사용자 정보 */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* 로그아웃 버튼 */}
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 