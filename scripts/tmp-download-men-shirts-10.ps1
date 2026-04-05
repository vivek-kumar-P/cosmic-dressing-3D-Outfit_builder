$ErrorActionPreference = 'Stop'

$target = 'e:/cosmic-dressing-3D-Outfit_builder/public/images/curated-fashion-50/men-shirts-10'
New-Item -ItemType Directory -Path $target -Force | Out-Null
Get-ChildItem -Path $target -File -Filter '*.jpg' -ErrorAction SilentlyContinue | Remove-Item -Force

$images = @(
  @{ Id='11100290'; Ext='jpeg' },
  @{ Id='10952730'; Ext='jpeg' },
  @{ Id='11100293'; Ext='jpeg' },
  @{ Id='11176397'; Ext='jpeg' },
  @{ Id='7444126'; Ext='jpeg' },
  @{ Id='264726'; Ext='jpeg' },
  @{ Id='9558723'; Ext='jpeg' },
  @{ Id='28576630'; Ext='jpeg' },
  @{ Id='22441317'; Ext='jpeg' },
  @{ Id='28297697'; Ext='jpeg' }
)

$i = 1
$downloaded = @()
foreach ($img in $images) {
  $url = "https://images.pexels.com/photos/$($img.Id)/pexels-photo-$($img.Id).$($img.Ext)?auto=compress&cs=tinysrgb&w=2000"
  $name = ('{0:D2}_men-shirt_{1}.jpg' -f $i, $img.Id)
  $outFile = Join-Path $target $name

  try {
    Invoke-WebRequest -Uri $url -OutFile $outFile -TimeoutSec 90
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
