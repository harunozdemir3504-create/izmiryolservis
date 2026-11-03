@echo off
set "DEST=C:\Users\Harun\Downloads\izmir-yol-yardim-fotograflar"
if not exist "%DEST%" mkdir "%DEST%"

echo Fotograflar indiriliyor...

curl.exe -L -s "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1200&q=85" -o "%DEST%\01-yusuf-musab-ozdemir-usta-profil.jpg"
echo [1/8] 01-yusuf-musab-ozdemir-usta-profil.jpg indirildi.

curl.exe -L -s "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=85" -o "%DEST%\02-kapida-motor-tamiri-mobil-servis.jpg"
echo [2/8] 02-kapida-motor-tamiri-mobil-servis.jpg indirildi.

curl.exe -L -s "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=85" -o "%DEST%\03-yerinde-periyodik-bakim-yag-filtre.jpg"
echo [3/8] 03-yerinde-periyodik-bakim-yag-filtre.jpg indirildi.

curl.exe -L -s "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85" -o "%DEST%\04-bilgisayarli-obd-ariza-tespiti.jpg"
echo [4/8] 04-bilgisayarli-obd-ariza-tespiti.jpg indirildi.

curl.exe -L -s "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85" -o "%DEST%\05-aku-takviye-ve-aku-degisimi.jpg"
echo [5/8] 05-aku-takviye-ve-aku-degisimi.jpg indirildi.

curl.exe -L -s "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1200&q=85" -o "%DEST%\06-yerinde-fren-balatasi-ve-disk.jpg"
echo [6/8] 06-yerinde-fren-balatasi-ve-disk.jpg indirildi.

curl.exe -L -s "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85" -o "%DEST%\07-oto-cekici-ve-kurtarici-hizmeti.jpg"
echo [7/8] 07-oto-cekici-ve-kurtarici-hizmeti.jpg indirildi.

curl.exe -L -s "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=85" -o "%DEST%\08-mobil-usta-motor-mekanik-onarim.jpg"
echo [8/8] 08-mobil-usta-motor-mekanik-onarim.jpg indirildi.

echo Tum fotograflar basariyla indirildi!
