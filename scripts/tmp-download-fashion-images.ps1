$ErrorActionPreference = "Stop"
$root = "e:/cosmic-dressing-3D-Outfit_builder"
$target = Join-Path $root "public/images/curated-fashion-50"
if (-not (Test-Path $target)) { New-Item -ItemType Directory -Path $target | Out-Null }
Get-ChildItem -Path $target -File -Filter "*.jpg" -ErrorAction SilentlyContinue | Remove-Item -Force

$imageLinks = @(
  @{ category = "fashion"; url = "https://images.pexels.com/photos/30816952/pexels-photo-30816952.jpeg?cs=srgb&dl=pexels-niko-mondi-313367152-30816952.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/10131765/pexels-photo-10131765.jpeg?cs=srgb&dl=pexels-cottonbro-10131765.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/21390399/pexels-photo-21390399.jpeg?cs=srgb&dl=pexels-katia-damyan-205356439-21390399.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/6069975/pexels-photo-6069975.jpeg?cs=srgb&dl=pexels-cottonbro-6069975.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/17143539/pexels-photo-17143539.jpeg?cs=srgb&dl=pexels-rafaalem-17143539.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/8396314/pexels-photo-8396314.jpeg?cs=srgb&dl=pexels-ron-lach-8396314.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/20441555/pexels-photo-20441555.jpeg?cs=srgb&dl=pexels-eyupcan-timur-424989336-20441555.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/8126157/pexels-photo-8126157.jpeg?cs=srgb&dl=pexels-rdne-8126157.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/12942612/pexels-photo-12942612.jpeg?cs=srgb&dl=pexels-rajeshverma-12942612.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/5325696/pexels-photo-5325696.jpeg?cs=srgb&dl=pexels-shvetsa-5325696.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/33572883/pexels-photo-33572883.jpeg?cs=srgb&dl=pexels-blackben-33572883.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/8945179/pexels-photo-8945179.jpeg?cs=srgb&dl=pexels-mart-production-8945179.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/6069954/pexels-photo-6069954.jpeg?cs=srgb&dl=pexels-cottonbro-6069954.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/7969812/pexels-photo-7969812.jpeg?cs=srgb&dl=pexels-cottonbro-7969812.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/12585895/pexels-photo-12585895.jpeg?cs=srgb&dl=pexels-iremmeric-12585895.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/9821877/pexels-photo-9821877.jpeg?cs=srgb&dl=pexels-cottonbro-9821877.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/29265225/pexels-photo-29265225.jpeg?cs=srgb&dl=pexels-anh-nguyen-517648218-29265225.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/18428517/pexels-photo-18428517.jpeg?cs=srgb&dl=pexels-er17-18428517.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/8443638/pexels-photo-8443638.jpeg?cs=srgb&dl=pexels-cottonbro-8443638.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/19198606/pexels-photo-19198606.png?cs=srgb&dl=pexels-tural-huseyn-799948724-19198606.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/5560606/pexels-photo-5560606.jpeg?cs=srgb&dl=pexels-tima-miroshnichenko-5560606.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/23947090/pexels-photo-23947090.jpeg?cs=srgb&dl=pexels-khezez-23947090.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/9811232/pexels-photo-9811232.jpeg?cs=srgb&dl=pexels-cottonbro-9811232.jpg&fm=jpg" },
  @{ category = "fashion"; url = "https://images.pexels.com/photos/29708198/pexels-photo-29708198.jpeg?cs=srgb&dl=pexels-alameenng-29708198.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/30799588/pexels-photo-30799588.jpeg?cs=srgb&dl=pexels-tomfisk-30799588.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/31642725/pexels-photo-31642725.jpeg?cs=srgb&dl=pexels-oguz-kagan-cevik-247212801-31642725.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/33558595/pexels-photo-33558595.jpeg?cs=srgb&dl=pexels-alexey-k-458081116-33558595.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/33690507/pexels-photo-33690507.jpeg?cs=srgb&dl=pexels-mrjuly-33690507.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/33558596/pexels-photo-33558596.jpeg?cs=srgb&dl=pexels-alexey-k-458081116-33558596.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/32528934/pexels-photo-32528934.jpeg?cs=srgb&dl=pexels-nguy-n-ti-n-th-nh-2150376175-32528934.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/8968349/pexels-photo-8968349.jpeg?cs=srgb&dl=pexels-toni-8968349.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/36812411/pexels-photo-36812411.jpeg?cs=srgb&dl=pexels-soc-nang-d-ng-2150345854-36812411.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/33409535/pexels-photo-33409535.jpeg?cs=srgb&dl=pexels-nguy-n-ti-n-th-nh-2150376175-33409535.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/30838490/pexels-photo-30838490.jpeg?cs=srgb&dl=pexels-introspectivedsgn-30838490.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/33409525/pexels-photo-33409525.jpeg?cs=srgb&dl=pexels-nguy-n-ti-n-th-nh-2150376175-33409525.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/6098254/pexels-photo-6098254.jpeg?cs=srgb&dl=pexels-ushindinamegabe-6098254.jpg&fm=jpg" },
  @{ category = "watches"; url = "https://images.pexels.com/photos/31513715/pexels-photo-31513715.jpeg?cs=srgb&dl=pexels-gizemtos-2150298361-31513715.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/31259705/pexels-photo-31259705.jpeg?cs=srgb&dl=pexels-alokkd1-31259705.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/2767694/pexels-photo-2767694.jpeg?cs=srgb&dl=pexels-enginakyurt-2767694.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/20106424/pexels-photo-20106424.jpeg?cs=srgb&dl=pexels-elif-tasli-889857993-20106424.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/29538714/pexels-photo-29538714.jpeg?cs=srgb&dl=pexels-amar-29538714.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/29274468/pexels-photo-29274468.jpeg?cs=srgb&dl=pexels-glassesshop-gs-1317359316-29274468.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/31658880/pexels-photo-31658880.jpeg?cs=srgb&dl=pexels-rachel-brooks-2149232858-31658880.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/31538078/pexels-photo-31538078.jpeg?cs=srgb&dl=pexels-fotios-photos-31538078.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/27347004/pexels-photo-27347004.jpeg?cs=srgb&dl=pexels-stefaniejockschat-27347004.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/343720/pexels-photo-343720.jpeg?cs=srgb&dl=pexels-asim-razan-343720.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/26575039/pexels-photo-26575039.jpeg?cs=srgb&dl=pexels-glassesshop-gs-1317359316-26575039.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/16692930/pexels-photo-16692930.jpeg?cs=srgb&dl=pexels-edslan-silva-541516710-16692930.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/5202051/pexels-photo-5202051.jpeg?cs=srgb&dl=pexels-karola-g-5202051.jpg&fm=jpg" },
  @{ category = "sunglasses"; url = "https://images.pexels.com/photos/27353347/pexels-photo-27353347.jpeg?cs=srgb&dl=pexels-glassesshop-gs-1317359316-27353347.jpg&fm=jpg" }
)

$seenPhotoIds = New-Object "System.Collections.Generic.HashSet[string]"
$downloaded = 0

foreach ($item in $imageLinks) {
  if ($downloaded -ge 50) { break }
  $idMatch = [regex]::Match($item.url, '/photos/(\d+)/')
  if (-not $idMatch.Success) { continue }
  $photoId = $idMatch.Groups[1].Value
  if ($seenPhotoIds.Contains($photoId)) { continue }
  $null = $seenPhotoIds.Add($photoId)

  $imgUrl = "$($item.url)&w=1600&fit=crop&auto=compress"
  $name = ("{0:D2}_{1}_{2}.jpg" -f ($downloaded + 1), $item.category, $photoId)
  $dest = Join-Path $target $name

  try {
    Invoke-WebRequest -Uri $imgUrl -OutFile $dest -Headers @{ "User-Agent" = "Mozilla/5.0" }
    $len = (Get-Item $dest).Length
    if ($len -lt 45000) {
      Remove-Item $dest -Force
      continue
    }
    $downloaded++
  } catch {
    if (Test-Path $dest) { Remove-Item $dest -Force }
  }
}

$manifest = Join-Path $target "manifest.txt"
"Downloaded: $downloaded images" | Out-File -FilePath $manifest -Encoding utf8
Get-ChildItem -Path $target -File -Filter "*.jpg" | Sort-Object Name | ForEach-Object {
  "$($_.Name) | $([math]::Round($_.Length / 1KB, 1)) KB"
} | Out-File -FilePath $manifest -Append -Encoding utf8

Write-Output "Downloaded images: $downloaded"
Get-ChildItem -Path $target -File | Select-Object Name, Length | Sort-Object Name | Format-Table -AutoSize | Out-String | Write-Output
