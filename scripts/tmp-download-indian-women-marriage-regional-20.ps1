$ErrorActionPreference = 'Stop'

$target = 'e:/cosmic-dressing-3D-Outfit_builder/public/images/curated-fashion-50/indian-women-marriage-regional-20'
New-Item -ItemType Directory -Path $target -Force | Out-Null

# Start clean for an exact 20-image set.
Get-ChildItem -Path $target -File -Filter '*.jpg' -ErrorAction SilentlyContinue | Remove-Item -Force

$images = @(
  @{ Region='bengali'; Url='https://images.pexels.com/photos/33359868/pexels-photo-33359868.jpeg?cs=srgb&dl=pexels-fliqaindia-33359868.jpg&fm=jpg' },
  @{ Region='bengali'; Url='https://images.pexels.com/photos/30184774/pexels-photo-30184774.jpeg?cs=srgb&dl=pexels-fliqaindia-30184774.jpg&fm=jpg' },
  @{ Region='bengali'; Url='https://images.pexels.com/photos/35808600/pexels-photo-35808600.jpeg?cs=srgb&dl=pexels-capturepoint-35808600.jpg&fm=jpg' },

  @{ Region='south-indian'; Url='https://images.pexels.com/photos/18156765/pexels-photo-18156765.jpeg?cs=srgb&dl=pexels-ravi-digital-studios-ak-photography-706126037-18156765.jpg&fm=jpg' },
  @{ Region='south-indian'; Url='https://images.pexels.com/photos/30685780/pexels-photo-30685780.jpeg?cs=srgb&dl=pexels-dream_-makkerzz-1603229-30685780.jpg&fm=jpg' },
  @{ Region='south-indian'; Url='https://images.pexels.com/photos/30276916/pexels-photo-30276916.jpeg?cs=srgb&dl=pexels-dream_-makkerzz-1603229-30276916.jpg&fm=jpg' },
  @{ Region='south-indian'; Url='https://images.pexels.com/photos/30458529/pexels-photo-30458529.jpeg?cs=srgb&dl=pexels-dream_-makkerzz-1603229-30458529.jpg&fm=jpg' },

  @{ Region='gujarati'; Url='https://images.pexels.com/photos/16782876/pexels-photo-16782876.jpeg?cs=srgb&dl=pexels-jignesh-vasava-376391917-16782876.jpg&fm=jpg' },
  @{ Region='gujarati'; Url='https://images.pexels.com/photos/32096958/pexels-photo-32096958.jpeg?cs=srgb&dl=pexels-fahadputhawala-32096958.jpg&fm=jpg' },
  @{ Region='gujarati'; Url='https://images.pexels.com/photos/28604240/pexels-photo-28604240.jpeg?cs=srgb&dl=pexels-picturebymv-28604240.jpg&fm=jpg' },

  @{ Region='punjabi'; Url='https://images.pexels.com/photos/36102601/pexels-photo-36102601.jpeg?cs=srgb&dl=pexels-framesbygaurav-36102601.jpg&fm=jpg' },
  @{ Region='punjabi'; Url='https://images.pexels.com/photos/35963150/pexels-photo-35963150.jpeg?cs=srgb&dl=pexels-deepak-sharma-503041381-35963150.jpg&fm=jpg' },
  @{ Region='punjabi'; Url='https://images.pexels.com/photos/15490164/pexels-photo-15490164.jpeg?cs=srgb&dl=pexels-pritpal-momi-3404733-15490164.jpg&fm=jpg' },

  @{ Region='rajasthani'; Url='https://images.pexels.com/photos/30214743/pexels-photo-30214743.jpeg?cs=srgb&dl=pexels-fotographiya-wedding-photography-823737813-30214743.jpg&fm=jpg' },
  @{ Region='rajasthani'; Url='https://images.pexels.com/photos/10773471/pexels-photo-10773471.jpeg?cs=srgb&dl=pexels-rohan-dewangan-2844320-10773471.jpg&fm=jpg' },
  @{ Region='rajasthani'; Url='https://images.pexels.com/photos/29160903/pexels-photo-29160903.jpeg?cs=srgb&dl=pexels-aayan-garg-362148303-29160903.jpg&fm=jpg' },

  @{ Region='maharashtrian'; Url='https://images.pexels.com/photos/18096049/pexels-photo-18096049.jpeg?cs=srgb&dl=pexels-sagar-ahire-688133929-18096049.jpg&fm=jpg' },
  @{ Region='maharashtrian'; Url='https://images.pexels.com/photos/32536130/pexels-photo-32536130.jpeg?cs=srgb&dl=pexels-daredevil-32536130.jpg&fm=jpg' },

  @{ Region='kashmiri'; Url='https://images.pexels.com/photos/27024449/pexels-photo-27024449.jpeg?cs=srgb&dl=pexels-mysara-hassan-116278479-27024449.jpg&fm=jpg' },
  @{ Region='kashmiri'; Url='https://images.pexels.com/photos/29513336/pexels-photo-29513336.jpeg?cs=srgb&dl=pexels-sam-clickx-24038849-29513336.jpg&fm=jpg' }
)

$i = 1
$downloaded = @()
foreach ($img in $images) {
  $id = [regex]::Match($img.Url, '/photos/(\d+)/').Groups[1].Value
  $name = ('{0:D2}_{1}_{2}.jpg' -f $i, $img.Region, $id)
  $outFile = Join-Path $target $name

  try {
    Invoke-WebRequest -Uri $img.Url -OutFile $outFile -TimeoutSec 90
    if ((Get-Item $outFile).Length -ge 50000) {
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
$downloaded | Sort-Object Name | ForEach-Object { "$($_.Name) | $([math]::Round($_.Length / 1KB, 1)) KB" } | Out-File -FilePath $manifest -Append -Encoding utf8

$downloaded | Sort-Object Name | Select-Object Name, Length
Write-Output ("Total downloaded: " + $downloaded.Count)
