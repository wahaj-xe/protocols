@echo off
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo   Pushing Protocols to github.com/wahaj-xe/protocols
echo ========================================================
echo.
git push -u origin main
echo.
pause
