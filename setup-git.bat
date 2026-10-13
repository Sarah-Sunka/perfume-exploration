@echo off
setlocal EnableDelayedExpansion
title One-time Git setup
echo ============================================
echo   One-time setup: who signs your snapshots
echo ============================================
echo.
echo Git needs your name and email so that every
echo saved snapshot (called a "commit") records
echo who made it. These stay on this computer -
echo nothing is sent anywhere.
echo.
:askname
set "gname="
set /p "gname=Type your name, then press Enter: "
if not defined gname (
  echo Please type something first.
  goto :askname
)
:askemail
set "gemail="
set /p "gemail=Type your email, then press Enter: "
if not defined gemail (
  echo Please type something first.
  goto :askemail
)
"C:\Users\faisa\.qoder\bin\git\mingw64\bin\git.exe" config --global user.name "!gname!"
"C:\Users\faisa\.qoder\bin\git\mingw64\bin\git.exe" config --global user.email "!gemail!"
echo.
echo ALL DONE! Your snapshots will be signed by:
"C:\Users\faisa\.qoder\bin\git\mingw64\bin\git.exe" config --global user.name
"C:\Users\faisa\.qoder\bin\git\mingw64\bin\git.exe" config --global user.email
echo.
echo You can close this window now.
pause
