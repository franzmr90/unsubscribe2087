@echo off
setlocal
cd /d "%~dp0"

set "NODE=node"
where node >nul 2>&1
if errorlevel 1 (
  if exist "%ProgramFiles%\nodejs\node.exe" (
    set "NODE=%ProgramFiles%\nodejs\node.exe"
  ) else (
    echo Node.js is not installed, so the game cannot start.
    echo.
    echo 1. Open https://nodejs.org
    echo 2. Download the LTS installer for Windows and run it.
    echo    Leave "Add to PATH" ticked.
    echo 3. Close this window and double-click Play-Unsubscribe-2087.bat again.
    echo.
    echo If Windows asks about the firewall after that: tick Private networks,
    echo leave Public networks unticked, and click Allow access.
    echo.
    pause
    exit /b 1
  )
)

"%NODE%" -e "process.exit(Number(process.versions.node.split('.')[0])>=18?0:1)"
if errorlevel 1 (
  echo Node.js is installed, but it is too old.
  echo Install version 18 or newer from https://nodejs.org and double-click this file again.
  pause
  exit /b 1
)

echo If a Windows Security Alert appears, tick Private networks only.
echo Leave Public networks unticked, and click Allow access.
echo Public networks are coffee shops and hotspots. Your house is a private network.
echo Leave this window open. Closing it stops the game for everyone.
echo More detail is in LAN-PLAY.md.
echo.

if not exist "saves" mkdir saves
set "LAN=1"
if not defined PORT set "PORT=8087"
set "DATA_DIR=%~dp0saves"
set "GITHUB_TOKEN="
set "TLS_KEY="
set "TLS_CERT="
set "INVITE_REQUIRED="
set "INVITE_CODES="
set "ALLOWLIST="
set "BUG_WEBHOOK_URL="
set "BUG_WEBHOOK_KEY="
set "PUBLIC_ORIGIN="

"%NODE%" server\server.js
echo.
echo The game stopped.
pause
endlocal
