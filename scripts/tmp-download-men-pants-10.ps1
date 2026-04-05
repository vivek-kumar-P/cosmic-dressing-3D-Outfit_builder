$ErrorActionPreference = 'Stop'

$target = 'e:/cosmic-dressing-3D-Outfit_builder/public/images/curated-fashion-50/men-pants-10'
New-Item -ItemType Directory -Path $target -Force | Out-Null
Get-ChildItem -Path $target -File -Filter '*.jpg' -ErrorAction SilentlyContinue | Remove-Item -Force

$images = @(
  @{ Id='4109797'; Url='https://images.pexels.com/photos/4109797/pexels-photo-4109797.jpeg?cs=srgb&dl=pexels-castorlystock-4109797.jpg&fm=jpg' },
  @{ Id='11176394'; Url='https://images.pexels.com/photos/11176394/pexels-photo-11176394.jpeg?cs=srgb&dl=pexels-onkar-salvi-28181962-11176394.jpg&fm=jpg' },
  @{ Id='6069087'; Url='https://images.pexels.com/photos/6069087/pexels-photo-6069087.jpeg?cs=srgb&dl=pexels-cottonbro-6069087.jpg&fm=jpg' },
  @{ Id='7764609'; Url='https://images.pexels.com/photos/7764609/pexels-photo-7764609.jpeg?cs=srgb&dl=pexels-cottonbro-7764609.jpg&fm=jpg' },
  @{ Id='7764608'; Url='https://images.pexels.com/photos/7764608/pexels-photo-7764608.jpeg?cs=srgb&dl=pexels-cottonbro-7764608.jpg&fm=jpg' },
  @{ Id='4546763'; Url='https://images.pexels.com/photos/4546763/pexels-photo-4546763.jpeg?cs=srgb&dl=pexels-2955122-4546763.jpg&fm=jpg' },
  @{ Id='6764143'; Url='https://images.pexels.com/photos/6764143/pexels-photo-6764143.jpeg?cs=srgb&dl=pexels-cottonbro-6764143.jpg&fm=jpg' },
  @{ Id='17265364'; Url='https://images.pexels.com/photos/17265364/pexels-photo-17265364.jpeg?cs=srgb&dl=pexels-dmitriy-steinke-559643503-17265364.jpg&fm=jpg' },
  @{ Id='52518'; Url='https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?cs=srgb&dl=pexels-pixabay-52518.jpg&fm=jpg' },
  @{ Id='4109759'; Url='https://images.pexels.com/photos/4109759/pexels-photo-4109759.jpeg?cs=srgb&dl=pexels-castorlystock-4109759.jpg&fm=jpg' }
)

$i = 1
$downloaded = @()
foreach ($img in $images) {
  $name = ('{0:D2}_men-pants_{1}.jpg' -f $i, $img.Id)
  $outFile = Join-Path $target $name

  try {
    Invoke-WebRequest -Uri $img.Url -OutFile $outFile -TimeoutSec 90
    if ((Get-Item $outFile).Length -ge 45000) {
      $downloaded += Get-Item $outFile
      $i++
    } else {
      Remove-Item $outFile -Force -ErrorAction SilentlyContinue
    }
  } catch {
    Remove-Item $outFile -Force -ErrorAction SilentlyContinue
  }
}

$manifest = Join-Path $target 'manifest.txt'
"Downloaded: $($downloaded.Count) images" | Out-File -FilePath $manifest -Encoding utf8
$downloaded | Sort-Object Name | ForEach-Object {
  "$($_.Name) | $([math]::Round($_.Length/1KB,1)) KB"
} | Out-File -FilePath $manifest -Append -Encoding utf8

$downloaded | Sort-Object Name | Select-Object Name,Length
Write-Output ("Total downloaded: " + $downloaded.Count)
