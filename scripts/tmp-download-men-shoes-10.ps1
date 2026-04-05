$ErrorActionPreference = "Stop"
$target = "e:/cosmic-dressing-3D-Outfit_builder/public/images/curated-fashion-50/men-shoes-10"
if (-not (Test-Path $target)) { New-Item -ItemType Directory -Path $target | Out-Null }

$images = @(
  @{ name = "01_loafers_9992899.jpg"; url = "https://images.pexels.com/photos/9992899/pexels-photo-9992899.jpeg?cs=srgb&dl=pexels-elnur-memmednebiyev-125323681-9992899.jpg&fm=jpg" },
  @{ name = "02_loafers_29258015.jpg"; url = "https://images.pexels.com/photos/29258015/pexels-photo-29258015.jpeg?cs=srgb&dl=pexels-adeelqureshiaq-29258015.jpg&fm=jpg" },
  @{ name = "03_brogue_6765524.jpg"; url = "https://images.pexels.com/photos/6765524/pexels-photo-6765524.jpeg?cs=srgb&dl=pexels-tima-miroshnichenko-6765524.jpg&fm=jpg" },
  @{ name = "04_formal-black_292999.jpg"; url = "https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?cs=srgb&dl=pexels-goumbik-292999.jpg&fm=jpg" },
  @{ name = "05_oxford_15059774.jpg"; url = "https://images.pexels.com/photos/15059774/pexels-photo-15059774.jpeg?cs=srgb&dl=pexels-collab-media-173741945-15059774.jpg&fm=jpg" },
  @{ name = "06_buckle_29494530.jpg"; url = "https://images.pexels.com/photos/29494530/pexels-photo-29494530.jpeg?cs=srgb&dl=pexels-arifeen-ali-938919-29494530.jpg&fm=jpg" },
  @{ name = "07_sneakers_18972408.jpg"; url = "https://images.pexels.com/photos/18972408/pexels-photo-18972408.jpeg?cs=srgb&dl=pexels-broxx-asia-177638957-18972408.jpg&fm=jpg" },
  @{ name = "08_sneakers_28819041.jpg"; url = "https://images.pexels.com/photos/28819041/pexels-photo-28819041.jpeg?cs=srgb&dl=pexels-dayne-f-3625870-28819041.jpg&fm=jpg" },
  @{ name = "09_sneakers_2048547.jpg"; url = "https://images.pexels.com/photos/2048547/pexels-photo-2048547.jpeg?cs=srgb&dl=pexels-amanjakhar-2048547.jpg&fm=jpg" },
  @{ name = "10_sneakers_684152.jpg"; url = "https://images.pexels.com/photos/684152/pexels-photo-684152.jpeg?cs=srgb&dl=pexels-athul-adhu-186900-684152.jpg&fm=jpg" }
)

foreach ($img in $images) {
  $dest = Join-Path $target $img.name
  if (Test-Path $dest) { continue }
  $u = "$($img.url)&w=1600&fit=crop&auto=compress"
  Invoke-WebRequest -Uri $u -OutFile $dest -Headers @{ "User-Agent" = "Mozilla/5.0" }
}

Get-ChildItem -Path $target -File -Filter "*.jpg" | Sort-Object Name | Select-Object Name, Length | Format-Table -AutoSize | Out-String | Write-Output
