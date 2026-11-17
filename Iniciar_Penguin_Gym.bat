@echo off
title Penguin Gym Linux
cd /d "%~dp0"
netstat -ano | findstr ":3000 " | findstr "LISTENING" >nul
if %errorlevel% neq 0 (
    start "" /B python -m http.server 3000 --bind 127.0.0.1 >nul 2>&1
    timeout /t 1 /nobreak >nul
)
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="http://127.0.0.1:3000" --window-size=1400,880
    exit /b 0
)
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app="http://127.0.0.1:3000" --window-size=1400,880
    exit /b 0
)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="http://127.0.0.1:3000" --window-size=1400,880
    exit /b 0
)
start "" "http://127.0.0.1:3000"
