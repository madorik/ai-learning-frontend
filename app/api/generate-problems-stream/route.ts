import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const backendUrl = `http://localhost:3000/api/generate-problems-stream?${searchParams.toString()}`
  
  console.log('SSE 프록시 요청:', backendUrl)

  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      console.error('백엔드 연결 실패:', response.status, response.statusText)
      return new Response(
        `data: ${JSON.stringify({ type: 'error', error: `백엔드 서버 오류: ${response.status}` })}\n\n`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    const stream = new ReadableStream({
      start(controller) {
        const reader = response.body?.getReader()
        
        if (!reader) {
          controller.close()
          return
        }

        function pump(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close()
              return
            }
            
            controller.enqueue(value)
            return pump()
          }).catch(error => {
            console.error('스트림 읽기 오류:', error)
            controller.error(error)
          })
        }

        return pump()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('SSE 프록시 오류:', error)
    return new Response(
      `data: ${JSON.stringify({ type: 'error', error: '백엔드 서버에 연결할 수 없습니다.' })}\n\n`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  }
} 