$ErrorActionPreference = 'Stop'

$target = 'e:/cosmic-dressing-3D-Outfit_builder/public/images/curated-fashion-50/women-wear-products-50'
New-Item -ItemType Directory -Path $target -Force | Out-Null

# Clean folder to keep exactly this curated set.
Get-ChildItem -Path $target -File -Filter '*.jpg' -ErrorAction SilentlyContinue | Remove-Item -Force

$images = @(
  # t-shirt (6)
  @{ Category='t-shirt'; Id='34156905'; Ext='jpeg' },
  @{ Category='t-shirt'; Id='34156906'; Ext='jpeg' },
  @{ Category='t-shirt'; Id='34156907'; Ext='jpeg' },
  @{ Category='t-shirt'; Id='12025472'; Ext='jpeg' },
  @{ Category='t-shirt'; Id='4440572'; Ext='jpeg' },
  @{ Category='t-shirt'; Id='36908588'; Ext='jpeg' },

  # pants (6)
  @{ Category='pants'; Id='17630811'; Ext='jpeg' },
  @{ Category='pants'; Id='17720437'; Ext='jpeg' },
  @{ Category='pants'; Id='4043588'; Ext='jpeg' },
  @{ Category='pants'; Id='6167280'; Ext='jpeg' },
  @{ Category='pants'; Id='4602025'; Ext='jpeg' },
  @{ Category='pants'; Id='3927390'; Ext='jpeg' },

  # shirts (6)
  @{ Category='shirts'; Id='12389567'; Ext='jpeg' },
  @{ Category='shirts'; Id='7444126'; Ext='jpeg' },
  @{ Category='shirts'; Id='6276005'; Ext='jpeg' },
  @{ Category='shirts'; Id='35675692'; Ext='jpeg' },
  @{ Category='shirts'; Id='7988710'; Ext='jpeg' },
  @{ Category='shirts'; Id='14870714'; Ext='jpeg' },

  # plazas (5)
  @{ Category='plazas'; Id='4452381'; Ext='jpeg' },
  @{ Category='plazas'; Id='4458521'; Ext='jpeg' },
  @{ Category='plazas'; Id='31961165'; Ext='jpeg' },
  @{ Category='plazas'; Id='12956068'; Ext='jpeg' },
  @{ Category='plazas'; Id='5405607'; Ext='jpeg' },

  # leggings (5)
  @{ Category='leggings'; Id='3927388'; Ext='jpeg' },
  @{ Category='leggings'; Id='3927386'; Ext='jpeg' },
  @{ Category='leggings'; Id='3927387'; Ext='jpeg' },
  @{ Category='leggings'; Id='3927383'; Ext='jpeg' },
  @{ Category='leggings'; Id='5405606'; Ext='jpeg' },

  # half kurta (5)
  @{ Category='half-kurta'; Id='19895963'; Ext='jpeg' },
  @{ Category='half-kurta'; Id='26297709'; Ext='jpeg' },
  @{ Category='half-kurta'; Id='22441317'; Ext='jpeg' },
  @{ Category='half-kurta'; Id='35508907'; Ext='jpeg' },
  @{ Category='half-kurta'; Id='20189052'; Ext='jpeg' },

  # full kurtas (5)
  @{ Category='full-kurtas'; Id='18533667'; Ext='jpeg' },
  @{ Category='full-kurtas'; Id='29138637'; Ext='jpeg' },
  @{ Category='full-kurtas'; Id='32331589'; Ext='png' },
  @{ Category='full-kurtas'; Id='36858771'; Ext='png' },
  @{ Category='full-kurtas'; Id='2737702'; Ext='jpeg' },

  # saaree (6)
  @{ Category='saaree'; Id='34056612'; Ext='jpeg' },
  @{ Category='saaree'; Id='35059564'; Ext='jpeg' },
  @{ Category='saaree'; Id='6167463'; Ext='jpeg' },
  @{ Category='saaree'; Id='5439052'; Ext='jpeg' },
  @{ Category='saaree'; Id='32427331'; Ext='jpeg' },
  @{ Category='saaree'; Id='30592270'; Ext='jpeg' },

  # night ware (6)
  @{ Category='night-ware'; Id='7235669'; Ext='jpeg' },
  @{ Category='night-ware'; Id='8104579'; Ext='jpeg' },
  @{ Category='night-ware'; Id='7445019'; Ext='jpeg' },
  @{ Category='night-ware'; Id='13535492'; Ext='jpeg' },
  @{ Category='night-ware'; Id='14382439'; Ext='jpeg' },
  @{ Category='night-ware'; Id='4374510'; Ext='jpeg' }
)

$i = 1
$downloaded = @()
foreach ($img in $images) {
  $url = "https://images.pexels.com/photos/$($img.Id)/pexels-photo-$($img.Id).$($img.Ext)?auto=compress&cs=tinysrgb&w=2000"
  $fileName = ('{0:D2}_{1}_{2}.jpg' -f $i, $img.Category, $img.Id)
  $outFile = Join-Path $target $fileName

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
  "$($_.Name) | $([math]::Round($_.Length / 1KB, 1)) KB"
} | Out-File -FilePath $manifest -Append -Encoding utf8

$downloaded | Sort-Object Name | Select-Object Name, Length
Write-Output ("Total downloaded: " + $downloaded.Count)
