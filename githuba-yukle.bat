@echo off
chcp 65001 >nul
echo ========================================================
echo   İzmir Yol Servis - GitHub Güncelleme Aracı
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Dosyalar hazırlanıyor...
git add index.html style.css script.js robots.txt sitemap.xml README.md images reels-assets

echo [2/3] Değişiklikler kaydediliyor...
git commit -m "Site güncelleme: Gerçek fotoğraflar ve düzenlemeler"

echo.
echo [3/3] GitHub'a yükleniyor (git push)...
echo.
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   BAŞARILI! Dosyalar GitHub'a yüklendi.
    echo   Sitedeki değişiklikleri görmek için tarayıcınızda
    echo   Ctrl + F5 tuşlarına basarak sayfayı sert yenileyin.
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   DİKKAT: GitHub'a gönderilirken bir uyarı oluştu.
    echo   Yukarıdaki hata mesajını kontrol ediniz.
    echo ========================================================
)

echo.
pause
