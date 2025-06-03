import { NextRequest, NextResponse } from 'next/server';

/**
 * 사용자 프로필 정보 조회
 * GET /auth/profile
 */
export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    
    console.log('=== /auth/profile 요청 받음 ===');
    console.log('Authorization 헤더:', authorization);
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.log('Bearer 토큰이 없음');
      return NextResponse.json(
        { error: 'Bearer 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    // 백엔드 서버로 사용자 정보 요청 전달
    const backendURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const targetURL = `${backendURL}/auth/profile`;
    
    console.log('백엔드 요청 URL:', targetURL);
    console.log('요청 헤더:', { Authorization: authorization });
    
    const response = await fetch(targetURL, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
    });

    console.log('백엔드 응답 상태:', response.status);
    console.log('백엔드 응답 헤더:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const userData = await response.json();
      console.log('백엔드에서 받은 사용자 데이터:', userData);
      return NextResponse.json(userData);
    } else {
      const errorText = await response.text();
      console.error('백엔드 사용자 정보 조회 실패:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      return NextResponse.json(
        { error: `백엔드 서버 오류: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    
    // 네트워크 오류인지 확인
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.');
      return NextResponse.json(
        { error: '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 