@echo off
set PATH=C:\Program Files\nodejs;%PATH%
cd /d %~dp0
echo Starting Protocol Explorer at http://localhost:5173/ ...
npm run dev
pause
