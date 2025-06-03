import { NextRequest, NextResponse } from 'next/server';

/**
 * 로그아웃 처리
 * POST /auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { error: 'Authorization 헤더가 필요합니다.' },
        { status: 401 }
      );
    }

    // 백엔드 서버로 로그아웃 요청 전달
    const backendURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${backendURL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return NextResponse.json({ message: '로그아웃 성공' });
    } else {
      console.error('백엔드 로그아웃 실패:', response.status);
      return NextResponse.json({ message: '로그아웃 완료' }); // 클라이언트에서는 성공으로 처리
    }
    
  } catch (error) {
    console.error('로그아웃 처리 오류:', error);
    return NextResponse.json({ message: '로그아웃 완료' }); // 오류가 있어도 클라이언트에서는 성공으로 처리
  }
} 