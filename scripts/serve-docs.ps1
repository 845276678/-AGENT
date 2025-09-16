param(
  [int]$Port = 8080,
  [string]$Root = (Resolve-Path '.').Path
)
Add-Type -AssemblyName System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $Root at $prefix (Ctrl+C to stop)"
$mime = @{ '.html'='text/html'; '.htm'='text/html'; '.yaml'='text/yaml'; '.yml'='text/yaml'; '.json'='application/json'; '.js'='text/javascript'; '.css'='text/css'; '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.gif'='image/gif'; '.md'='text/markdown' }
try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
    if ($path -eq '/') { $path = '/docs/api/index.html' }
    $local = Join-Path $Root $path.TrimStart('/')
    if (Test-Path $local -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($local)
      $ext = [IO.Path]::GetExtension($local).ToLower()
      $res.ContentType = $mime[$ext]
      $res.OutputStream.Write($bytes,0,$bytes.Length)
    } elseif (Test-Path $local -PathType Container) {
      $index = Join-Path $local 'index.html'
      if (Test-Path $index) {
        $bytes = [System.IO.File]::ReadAllBytes($index)
        $res.ContentType = 'text/html'
        $res.OutputStream.Write($bytes,0,$bytes.Length)
      } else { $res.StatusCode = 403 }
    } else {
      $res.StatusCode = 404
    }
    $res.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
