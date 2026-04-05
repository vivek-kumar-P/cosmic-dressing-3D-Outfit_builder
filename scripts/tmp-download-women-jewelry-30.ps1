$ErrorActionPreference = "Stop"
$target = "e:/cosmic-dressing-3D-Outfit_builder/public/images/curated-fashion-50/women-jewelry-30"
if (-not (Test-Path $target)) { New-Item -ItemType Directory -Path $target | Out-Null }
Get-ChildItem -Path $target -File -Filter "*.jpg" -ErrorAction SilentlyContinue | Remove-Item -Force

$images = @(
  @{ name = "01_necklace_29385413.jpg"; url = "https://images.pexels.com/photos/29385413/pexels-photo-29385413.jpeg?cs=srgb&dl=pexels-anthony-seejo-2114739347-29385413.jpg&fm=jpg" },
  @{ name = "02_necklace_19288669.jpg"; url = "https://images.pexels.com/photos/19288669/pexels-photo-19288669.jpeg?cs=srgb&dl=pexels-maryami-19288669.jpg&fm=jpg" },
  @{ name = "03_necklace_14041631.jpg"; url = "https://images.pexels.com/photos/14041631/pexels-photo-14041631.jpeg?cs=srgb&dl=pexels-leon-kohle-3158283-14041631.jpg&fm=jpg" },
  @{ name = "04_necklace_32780784.jpg"; url = "https://images.pexels.com/photos/32780784/pexels-photo-32780784.jpeg?cs=srgb&dl=pexels-m-kamran-arvi-513966029-32780784.jpg&fm=jpg" },
  @{ name = "05_necklace_10862230.jpg"; url = "https://images.pexels.com/photos/10862230/pexels-photo-10862230.jpeg?cs=srgb&dl=pexels-photosbychalo-10862230.jpg&fm=jpg" },
  @{ name = "06_necklace_4295010.jpg"; url = "https://images.pexels.com/photos/4295010/pexels-photo-4295010.jpeg?cs=srgb&dl=pexels-lappen-fashion-2754326-4295010.jpg&fm=jpg" },
  @{ name = "07_necklace_31970995.jpg"; url = "https://images.pexels.com/photos/31970995/pexels-photo-31970995.jpeg?cs=srgb&dl=pexels-nikolaos-d-nomikos-2151019299-31970995.jpg&fm=jpg" },
  @{ name = "08_necklace_29642394.jpg"; url = "https://images.pexels.com/photos/29642394/pexels-photo-29642394.jpeg?cs=srgb&dl=pexels-medine-dilek-kizmaz-7160768-29642394.jpg&fm=jpg" },
  @{ name = "09_necklace_4295006.jpg"; url = "https://images.pexels.com/photos/4295006/pexels-photo-4295006.jpeg?cs=srgb&dl=pexels-lappen-fashion-2754326-4295006.jpg&fm=jpg" },
  @{ name = "10_necklace_19821929.jpg"; url = "https://images.pexels.com/photos/19821929/pexels-photo-19821929.jpeg?cs=srgb&dl=pexels-soner-akaydin-899720794-19821929.jpg&fm=jpg" },

  @{ name = "11_earrings_12145096.jpg"; url = "https://images.pexels.com/photos/12145096/pexels-photo-12145096.jpeg?cs=srgb&dl=pexels-duygukamar-12145096.jpg&fm=jpg" },
  @{ name = "12_earrings_12145058.jpg"; url = "https://images.pexels.com/photos/12145058/pexels-photo-12145058.jpeg?cs=srgb&dl=pexels-duygukamar-12145058.jpg&fm=jpg" },
  @{ name = "13_earrings_4225085.jpg"; url = "https://images.pexels.com/photos/4225085/pexels-photo-4225085.jpeg?cs=srgb&dl=pexels-anastasia-krylova-2660367-4225085.jpg&fm=jpg" },
  @{ name = "14_earrings_32989029.jpg"; url = "https://images.pexels.com/photos/32989029/pexels-photo-32989029.jpeg?cs=srgb&dl=pexels-kunal-lakhotia-781256899-32989029.jpg&fm=jpg" },
  @{ name = "15_earrings_35270127.jpg"; url = "https://images.pexels.com/photos/35270127/pexels-photo-35270127.jpeg?cs=srgb&dl=pexels-deja-vu-studio-2154209107-35270127.jpg&fm=jpg" },
  @{ name = "16_earrings_31285201.jpg"; url = "https://images.pexels.com/photos/31285201/pexels-photo-31285201.jpeg?cs=srgb&dl=pexels-hashtag-melvin-1163687-31285201.jpg&fm=jpg" },
  @{ name = "17_earrings_35933225.jpg"; url = "https://images.pexels.com/photos/35933225/pexels-photo-35933225.jpeg?cs=srgb&dl=pexels-hatice-genc-3580692-35933225.jpg&fm=jpg" },
  @{ name = "18_earrings_32797480.jpg"; url = "https://images.pexels.com/photos/32797480/pexels-photo-32797480.jpeg?cs=srgb&dl=pexels-hatice-genc-3580692-32797480.jpg&fm=jpg" },
  @{ name = "19_earrings_12144990.jpg"; url = "https://images.pexels.com/photos/12144990/pexels-photo-12144990.jpeg?cs=srgb&dl=pexels-duygukamar-12144990.jpg&fm=jpg" },
  @{ name = "20_earrings_31605853.jpg"; url = "https://images.pexels.com/photos/31605853/pexels-photo-31605853.jpeg?cs=srgb&dl=pexels-the-glorious-studio-3584518-31605853.jpg&fm=jpg" },

  @{ name = "21_bracelet_29385411.jpg"; url = "https://images.pexels.com/photos/29385411/pexels-photo-29385411.jpeg?cs=srgb&dl=pexels-anthony-seejo-2114739347-29385411.jpg&fm=jpg" },
  @{ name = "22_bracelet_32874211.jpg"; url = "https://images.pexels.com/photos/32874211/pexels-photo-32874211.jpeg?cs=srgb&dl=pexels-hatice-genc-3580692-32874211.jpg&fm=jpg" },
  @{ name = "23_bracelet_34549907.jpg"; url = "https://images.pexels.com/photos/34549907/pexels-photo-34549907.jpeg?cs=srgb&dl=pexels-cesar-o-neill-26650613-34549907.jpg&fm=jpg" },
  @{ name = "24_bracelet_34399148.jpg"; url = "https://images.pexels.com/photos/34399148/pexels-photo-34399148.jpeg?cs=srgb&dl=pexels-svliiim-34399148.jpg&fm=jpg" },
  @{ name = "25_bracelet_32392679.jpg"; url = "https://images.pexels.com/photos/32392679/pexels-photo-32392679.jpeg?cs=srgb&dl=pexels-raana-jenab-594484578-32392679.jpg&fm=jpg" },
  @{ name = "26_bracelet_20724559.jpg"; url = "https://images.pexels.com/photos/20724559/pexels-photo-20724559.jpeg?cs=srgb&dl=pexels-pinar-demircan-baran-1025467965-20724559.jpg&fm=jpg" },
  @{ name = "27_bracelet_14666597.jpg"; url = "https://images.pexels.com/photos/14666597/pexels-photo-14666597.jpeg?cs=srgb&dl=pexels-jibarofoto-14666597.jpg&fm=jpg" },
  @{ name = "28_bracelet_12194299.jpg"; url = "https://images.pexels.com/photos/12194299/pexels-photo-12194299.jpeg?cs=srgb&dl=pexels-mlkbnl-12194299.jpg&fm=jpg" },
  @{ name = "29_bracelet_10950896.jpg"; url = "https://images.pexels.com/photos/10950896/pexels-photo-10950896.jpeg?cs=srgb&dl=pexels-alexeydemidov-10950896.jpg&fm=jpg" },
  @{ name = "30_bracelet_8867716.jpg"; url = "https://images.pexels.com/photos/8867716/pexels-photo-8867716.jpeg?cs=srgb&dl=pexels-velros-8867716.jpg&fm=jpg" }
)

foreach ($img in $images) {
  $dest = Join-Path $target $img.name
  $u = "$($img.url)&w=1600&fit=crop&auto=compress"
  Invoke-WebRequest -Uri $u -OutFile $dest -Headers @{ "User-Agent" = "Mozilla/5.0" }
}

Get-ChildItem -Path $target -File -Filter "*.jpg" | Sort-Object Name | Select-Object Name, Length | Format-Table -AutoSize | Out-String | Write-Output
