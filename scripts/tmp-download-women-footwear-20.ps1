$ErrorActionPreference = "Stop"
$target = "e:/cosmic-dressing-3D-Outfit_builder/public/images/curated-fashion-50/women-footwear-20"
if (-not (Test-Path $target)) { New-Item -ItemType Directory -Path $target | Out-Null }
Get-ChildItem -Path $target -File -Filter "*.jpg" -ErrorAction SilentlyContinue | Remove-Item -Force

$images = @(
  @{ name = "01_sandals_29096391.jpg"; url = "https://images.pexels.com/photos/29096391/pexels-photo-29096391.jpeg?cs=srgb&dl=pexels-pedrofurtadoo-29096391.jpg&fm=jpg" },
  @{ name = "02_sandals_17740564.jpg"; url = "https://images.pexels.com/photos/17740564/pexels-photo-17740564.jpeg?cs=srgb&dl=pexels-alokkd1-17740564.jpg&fm=jpg" },
  @{ name = "03_sandals_27204291.jpg"; url = "https://images.pexels.com/photos/27204291/pexels-photo-27204291.jpeg?cs=srgb&dl=pexels-jose-martin-segura-benites-1422456152-27204291.jpg&fm=jpg" },
  @{ name = "04_sandals_27046150.jpg"; url = "https://images.pexels.com/photos/27046150/pexels-photo-27046150.jpeg?cs=srgb&dl=pexels-jose-martin-segura-benites-1422456152-27046150.jpg&fm=jpg" },
  @{ name = "05_sandals_31450985.jpg"; url = "https://images.pexels.com/photos/31450985/pexels-photo-31450985.jpeg?cs=srgb&dl=pexels-pedrofurtadoo-31450985.jpg&fm=jpg" },

  @{ name = "06_slippers_17740561.jpg"; url = "https://images.pexels.com/photos/17740561/pexels-photo-17740561.jpeg?cs=srgb&dl=pexels-alokkd1-17740561.jpg&fm=jpg" },
  @{ name = "07_slippers_12969102.jpg"; url = "https://images.pexels.com/photos/12969102/pexels-photo-12969102.jpeg?cs=srgb&dl=pexels-freestockpro-12969102.jpg&fm=jpg" },
  @{ name = "08_slippers_14187813.jpg"; url = "https://images.pexels.com/photos/14187813/pexels-photo-14187813.jpeg?cs=srgb&dl=pexels-nerosable-14187813.jpg&fm=jpg" },
  @{ name = "09_slippers_17740568.jpg"; url = "https://images.pexels.com/photos/17740568/pexels-photo-17740568.jpeg?cs=srgb&dl=pexels-alokkd1-17740568.jpg&fm=jpg" },
  @{ name = "10_slippers_9267584.jpg"; url = "https://images.pexels.com/photos/9267584/pexels-photo-9267584.jpeg?cs=srgb&dl=pexels-denys-9267584.jpg&fm=jpg" },

  @{ name = "11_heels_3782789.jpg"; url = "https://images.pexels.com/photos/3782789/pexels-photo-3782789.jpeg?cs=srgb&dl=pexels-bellazhong-3782789.jpg&fm=jpg" },
  @{ name = "12_heels_10827097.jpg"; url = "https://images.pexels.com/photos/10827097/pexels-photo-10827097.jpeg?cs=srgb&dl=pexels-mahsima-10827097.jpg&fm=jpg" },
  @{ name = "13_heels_29393718.jpg"; url = "https://images.pexels.com/photos/29393718/pexels-photo-29393718.jpeg?cs=srgb&dl=pexels-nadin-sh-78971847-29393718.jpg&fm=jpg" },
  @{ name = "14_heels_34736060.jpg"; url = "https://images.pexels.com/photos/34736060/pexels-photo-34736060.jpeg?cs=srgb&dl=pexels-dacostashotit-34736060.jpg&fm=jpg" },
  @{ name = "15_heels_29870211.jpg"; url = "https://images.pexels.com/photos/29870211/pexels-photo-29870211.png?cs=srgb&dl=pexels-jose-martin-segura-benites-1422456152-29870211.jpg&fm=jpg" },
  @{ name = "16_heels_3682290.jpg"; url = "https://images.pexels.com/photos/3682290/pexels-photo-3682290.jpeg?cs=srgb&dl=pexels-castorlystock-3682290.jpg&fm=jpg" },
  @{ name = "17_heels_26965806.jpg"; url = "https://images.pexels.com/photos/26965806/pexels-photo-26965806.jpeg?cs=srgb&dl=pexels-jose-martin-segura-benites-1422456152-26965806.jpg&fm=jpg" },
  @{ name = "18_heels_5610717.jpg"; url = "https://images.pexels.com/photos/5610717/pexels-photo-5610717.jpeg?cs=srgb&dl=pexels-ihsanaditya-5610717.jpg&fm=jpg" },
  @{ name = "19_heels_27204295.jpg"; url = "https://images.pexels.com/photos/27204295/pexels-photo-27204295.jpeg?cs=srgb&dl=pexels-jose-martin-segura-benites-1422456152-27204295.jpg&fm=jpg" },
  @{ name = "20_heels_27023941.jpg"; url = "https://images.pexels.com/photos/27023941/pexels-photo-27023941.jpeg?cs=srgb&dl=pexels-wo-nfoni-media-311038690-27023941.jpg&fm=jpg" }
)

foreach ($img in $images) {
  $dest = Join-Path $target $img.name
  $u = "$($img.url)&w=1600&fit=crop&auto=compress"
  Invoke-WebRequest -Uri $u -OutFile $dest -Headers @{ "User-Agent" = "Mozilla/5.0" }
}

Get-ChildItem -Path $target -File -Filter "*.jpg" | Sort-Object Name | Select-Object Name, Length | Format-Table -AutoSize | Out-String | Write-Output
