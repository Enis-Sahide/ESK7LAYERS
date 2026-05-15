$keyPath = "$env:USERPROFILE\.ssh\id_ed25519"

Write-Host "SSH Anahtari Izinleri Duzeltiliyor: $keyPath" -ForegroundColor Cyan

# 1. Dosyanin sahipligini zorla alin (Erisim engellendiyi asmak icin)
takeown /F $keyPath

# 2. Tum devralinan izinleri kaldirin
icacls $keyPath /inheritance:r

# 3. Sadece mevcut kullaniciya (size) okuma izni verin
icacls $keyPath /grant "$($env:USERNAME):(R)"

# 4. Sistemin veya yoneticilerin okumasini kaldirin (OpenSSH kurallari geregi)
icacls $keyPath /remove "NT AUTHORITY\SYSTEM" /c /q
icacls $keyPath /remove "BUILTIN\Administrators" /c /q

Write-Host "------------------------------------------------"
Write-Host "Islem Tamamlandi! Lutfen simdi terminalde su komutu calistirin:" -ForegroundColor Green
Write-Host "ssh-add `$HOME\.ssh\id_ed25519" -ForegroundColor Yellow
