import { NextRequest, NextResponse } from 'next/server';

/**
 * Google OAuth 로그인 시작
 * GET /auth/google
 */
export async function GET(request: NextRequest) {
  try {
    // 실제 백엔드 서버(3000번 포트)로 리디렉션
    const backendURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const redirectURL = `${backendURL}/auth/google`;
    
    console.log('Google OAuth 로그인 시작 - 백엔드로 리디렉션:', redirectURL);
    
    // 백엔드의 Google OAuth 엔드포인트로 리디렉션
    return NextResponse.redirect(redirectURL);
    
  } catch (error) {
    console.error('Google OAuth 오류:', error);
    
    return NextResponse.json(
      { error: 'Google OAuth 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 