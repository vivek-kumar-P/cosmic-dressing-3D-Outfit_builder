$ErrorActionPreference = "Stop"

$root = "e:/cosmic-dressing-3D-Outfit_builder"
$target = Join-Path $root "public/images/curated-fashion-50"
if (-not (Test-Path $target)) { throw "Target folder not found: $target" }

$testFile = Join-Path $target "_test.jpg"
if (Test-Path $testFile) { Remove-Item $testFile -Force }

# Seed existing hashes so new additions are unique against current 50 files.
$hashes = New-Object "System.Collections.Generic.HashSet[string]"
Get-ChildItem -Path $target -Filter "*.jpg" -File | ForEach-Object {
  try {
    $h = (Get-FileHash -Path $_.FullName -Algorithm SHA256).Hash
    if (-not [string]::IsNullOrWhiteSpace($h)) { $null = $hashes.Add($h) }
  } catch {}
}

$categories = @(
  @{ key = "men-fashion"; tags = "men,fashion,style,outfit" },
  @{ key = "women-fashion"; tags = "women,fashion,style,outfit" },
  @{ key = "boys-fashion"; tags = "boy,kids,fashion,clothes" },
  @{ key = "girls-fashion"; tags = "girl,kids,fashion,clothes" },
  @{ key = "mens-shoes"; tags = "men,shoes,sneakers,style" },
  @{ key = "womens-heels"; tags = "women,heels,shoes,fashion" },
  @{ key = "bracelets"; tags = "bracelet,jewelry,fashion,accessory" },
  @{ key = "mens-blazers"; tags = "men,blazer,suit,fashion" },
  @{ key = "marriage-wear"; tags = "wedding,dress,suit,ceremony" },
  @{ key = "indian-wedding-men"; tags = "indian,wedding,men,sherwani" },
  @{ key = "indian-wedding-women"; tags = "indian,wedding,women,saree,lehenga" },
  @{ key = "indian-wedding-kids"; tags = "indian,wedding,kids,traditional" },
  @{ key = "mens-swimwear"; tags = "men,swimwear,beach,summer" },
  @{ key = "womens-swimwear"; tags = "women,swimwear,beach,summer" },
  @{ key = "mens-gymwear"; tags = "men,gymwear,fitness,sportswear" },
  @{ key = "womens-gymwear"; tags = "women,gymwear,fitness,sportswear" }
)

$desired = 100
$added = 0
$globalSeed = 5000
$maxAttempts = 500
$attempt = 0

while ($added -lt $desired -and $attempt -lt $maxAttempts) {
  foreach ($c in $categories) {
    if ($added -ge $desired) { break }
    $attempt++
    $globalSeed++

    $sourceUrl = "https://loremflickr.com/1600/2200/$($c.tags)?lock=$globalSeed"
    $index = 51 + $added
    $name = ("{0:D3}_{1}_{2}.jpg" -f $index, $c.key, $globalSeed)
    $dest = Join-Path $target $name

    try {
      Invoke-WebRequest -Uri $sourceUrl -OutFile $dest -Headers @{ "User-Agent" = "Mozilla/5.0" }

      $size = (Get-Item $dest).Length
      if ($size -lt 45000) {
        Remove-Item $dest -Force
        continue
      }

      $newHash = (Get-FileHash -Path $dest -Algorithm SHA256).Hash
      if ($hashes.Contains($newHash)) {
        Remove-Item $dest -Force
        continue
      }

      $null = $hashes.Add($newHash)
      $added++
    } catch {
      if (Test-Path $dest) { Remove-Item $dest -Force }
      continue
    }
  }
}

$allJpg = Get-ChildItem -Path $target -Filter "*.jpg" -File | Sort-Object Name
$manifest = Join-Path $target "manifest.txt"
"Downloaded: $($allJpg.Count) images" | Out-File -FilePath $manifest -Encoding utf8
$allJpg | ForEach-Object {
  "$($_.Name) | $([math]::Round($_.Length / 1KB, 1)) KB"
} | Out-File -FilePath $manifest -Append -Encoding utf8

Write-Output "Added new images: $added"
Write-Output "Total JPG images now: $($allJpg.Count)"
$allJpg | Select-Object -Last 20 | Select-Object Name, Length | Format-Table -AutoSize | Out-String | Write-Output
