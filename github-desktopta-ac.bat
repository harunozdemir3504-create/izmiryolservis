@echo off
chcp 65001 >nul
cls
echo ========================================================
echo       GITHUB DESKTOP'A PROJEYI EKLEME YARDIMCISI
echo ========================================================
echo.
set "PROJ_PATH=%~dp0"
set "PROJ_PATH=%PROJ_PATH:~0,-1%"

echo %PROJ_PATH%| clip

echo [OK] Projenin tam klasör yolu panoya kopyalandı!
echo.
echo Kopyalanan Yol:
echo %PROJ_PATH%
echo.
echo --------------------------------------------------------
echo ŞİMDİ GITHUB DESKTOP'TA YAPMAN GEREKENLER:
echo --------------------------------------------------------
echo 1. GitHub Desktop programını aç.
echo 2. Sol üstten "File" -> "Add Local Repository..." seç
echo    (veya klavyeden Ctrl + O tuşlarına bas).
echo 3. "Local path" kutucuğuna tıkla ve Yapıştır (Ctrl + V) yap.
echo 4. "Add repository" butonuna bas!
echo.
echo Bu kadar! Projen anında GitHub Desktop'a eklenecek.
echo ========================================================
echo.
pause
