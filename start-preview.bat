@echo off
set PATH=C:\Program Files\nodejs;%PATH%
cd /d %~dp0
echo Starting Protocol Explorer Production Server at http://localhost:4173/ ...
npm run preview
pause
