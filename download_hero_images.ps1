# Create directory if it doesn't exist
$heroDir = "public/hero"
if (!(Test-Path -Path $heroDir)) {
    New-Item -ItemType Directory -Path $heroDir
}

# List of High-Quality Image URLs
$imageUrls = @(
    "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/306500/306565.jpg",
    "https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2017/01/19/Pictures/_d45f7560-de67-11e6-94bf-802521e425e4.jpg",
    "https://images.news18.com/ibnlive/uploads/2023/06/untitled-design-2023-06-02t133345.545-16856930433x2.jpg",
    "https://static.crictracker.com/media/content/2021/07/MS-Dhoni-Test-Century.jpg",
    "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1280,q_70/lsci/db/PICTURES/CMS/264500/264555.jpg",
    "https://w0.peakpx.com/wallpaper/594/412/HD-wallpaper-ms-dhoni-indian-cricketers-poster-mahendra-singh-dhoni-india-national-cricket-team-dhoni.jpg",
    "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2019/01/18/Pictures/australia-cricket-odi-india_37b88934-1b12-11e9-9137-0235ed3dfd74.jpg",
    "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202308/suresh-raina-and-ms-dhoni-155909874-16x9_0.jpg",
    "https://www.deccanherald.com/sites/dh/files/styles/article_detail/public/article_images/2020/05/19/file7an4p9k6e2w1j317k4d-1589886362.jpg",
    "https://wallpaperaccess.com/full/1569726.jpg",
    "https://wallpaperaccess.com/full/1569728.jpg",
    "https://wallpaperaccess.com/full/1569739.jpg",
    "https://wallpaperaccess.com/full/1569752.jpg",
    "https://wallpaperaccess.com/full/1569781.jpg",
    "https://wallpaperaccess.com/full/2221087.jpg"
)

Write-Host "Starting download of hero images..."
$count = 1

foreach ($url in $imageUrls) {
    $filename = "hero-$count.jpg"
    $filepath = Join-Path $heroDir $filename
    
    try {
        Write-Host "Downloading $filename..."
        Invoke-WebRequest -Uri $url -OutFile $filepath -UserAgent "Mozilla/5.0"
        $count++
    }
    catch {
        Write-Host "Failed to download $url" -ForegroundColor Red
    }
}

Write-Host "Download complete! Images saved to $heroDir"
Write-Host "You can add more images to this folder manually if you wish."
