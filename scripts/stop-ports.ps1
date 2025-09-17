param([int[]]$ports = @(8000,3000))
foreach($p in $ports){ Get-NetTCPConnection -State Listen -LocalPort $p -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }
Write-Output "Stopped listeners on ports: $($ports -join ', ')"