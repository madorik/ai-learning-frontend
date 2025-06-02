@echo off
echo AI 수학 문제지 생성기 시작...
echo.

REM 백엔드 서버 시작
echo 백엔드 서버를 시작합니다...
cd backend
start cmd /k "npm run dev"

REM 잠시 대기
timeout /t 3 /nobreak > nul

REM 프론트엔드 서버 시작
echo 프론트엔드 서버를 시작합니다...
cd ../frontend
start cmd /k "npm start"

echo.
echo 서버가 시작되었습니다!
echo 백엔드: http://localhost:5000
echo 프론트엔드: http://localhost:3000
echo.
pause 