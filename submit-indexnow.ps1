# IndexNow URL Submission Script
# Run AFTER deploying the site so the key file is live at:
# https://unscramblewordspro.com/da7d35cb7f4f4635aaf60ba6443d3b29.txt

$key         = "da7d35cb7f4f4635aaf60ba6443d3b29"
$host        = "unscramblewordspro.com"
$keyLocation = "https://unscramblewordspro.com/$key.txt"
$sitemapPath = "C:\Users\tripa\OneDrive\Desktop\Software Projects\Unscrambler\sitemap.xml"

# Parse all <loc> URLs from sitemap.xml
[xml]$sitemap = Get-Content $sitemapPath -Encoding UTF8
$urls = $sitemap.urlset.url.loc | Where-Object { $_ -ne $null }

Write-Host "Found $($urls.Count) URLs in sitemap.xml"

# Split into batches of 10,000 (IndexNow limit)
$batchSize = 10000
$batches = [System.Collections.Generic.List[object]]::new()
for ($i = 0; $i -lt $urls.Count; $i += $batchSize) {
  $batches.Add($urls[$i..([Math]::Min($i + $batchSize - 1, $urls.Count - 1))])
}

$batchNum = 1
foreach ($batch in $batches) {
  $body = @{
    host        = $host
    key         = $key
    keyLocation = $keyLocation
    urlList     = @($batch)
  } | ConvertTo-Json -Depth 3

  Write-Host "`nSubmitting batch $batchNum ($($batch.Count) URLs) to IndexNow..."
  try {
    $response = Invoke-WebRequest `
      -Uri "https://api.indexnow.org/IndexNow" `
      -Method POST `
      -ContentType "application/json; charset=utf-8" `
      -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) `
      -UseBasicParsing `
      -ErrorAction Stop

    Write-Host "Response: HTTP $($response.StatusCode) — $($response.StatusDescription)"
    if ($response.StatusCode -eq 200) {
      Write-Host "SUCCESS: All URLs in batch $batchNum accepted."
    }
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "HTTP $code error: $($_.Exception.Message)"
    switch ($code) {
      400 { Write-Host "Bad request — check JSON format." }
      403 { Write-Host "Forbidden — key file not found on live server. Deploy first!" }
      422 { Write-Host "Unprocessable — URLs don't belong to host or key mismatch." }
      429 { Write-Host "Too Many Requests — wait and retry." }
    }
  }
  $batchNum++
}

Write-Host "`nDone. Verify submission at https://www.bing.com/webmasters"
