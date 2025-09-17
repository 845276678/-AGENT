$ErrorActionPreference='SilentlyContinue'
function Kill-Port([int]$port){ Get-NetTCPConnection -State Listen -LocalPort $port | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force } }
Kill-Port 8000; Kill-Port 3000
Start-Process -FilePath node -ArgumentList "dev-api/server.mjs" -WorkingDirectory "$PSScriptRoot\.." | Out-Null
Start-Process -FilePath cmd.exe -ArgumentList '/c','npm','-w','web','run','dev' -WorkingDirectory "$PSScriptRoot\.." | Out-Null
Write-Output "Started Mock API (8000) and Web (3000)."