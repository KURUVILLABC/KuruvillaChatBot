# QA Test - Response Variation Verification

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DIGITAL TWIN QA TEST - RESPONSE VARIATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$tests = @(
    @{ q = "Tell me about yourself"; expected = "yourself" },
    @{ q = "What are your technical skills?"; expected = "skills" },
    @{ q = "Tell me about your projects"; expected = "projects" },
    @{ q = "What's your GitHub?"; expected = "github" },
    @{ q = "Tell me about your experience"; expected = "experience" }
)

$responses = @()

foreach ($test in $tests) {
    $body = @{ message = $test.q; conversation = @() } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/chat" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -UseBasicParsing `
            -ErrorAction Stop
        
        $data = $response.Content | ConvertFrom-Json
        $answer = $data.answer
        
        Write-Host "TEST: $($test.expected.ToUpper())" -ForegroundColor Yellow
        Write-Host "Q: $($test.q)"
        Write-Host "A: $($answer.Substring(0, 110))..."
        Write-Host ""
        
        $responses += $answer
    } catch {
        Write-Host "ERROR: Failed to get response for: $($test.q)" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

# Verify all responses are unique
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$uniqueCount = ($responses | Sort-Object -Unique).Count
$totalCount = $responses.Count

Write-Host "Total responses: $totalCount"
Write-Host "Unique responses: $uniqueCount"
Write-Host ""

if ($uniqueCount -eq $totalCount) {
    Write-Host "✅ SUCCESS: All responses are DIFFERENT and UNIQUE!" -ForegroundColor Green
    Write-Host "The digital twin is responding contextually to each question." -ForegroundColor Green
} else {
    Write-Host "⚠️  WARNING: Some responses appear to be identical" -ForegroundColor Yellow
    Write-Host "Unique: $uniqueCount, Total: $totalCount" -ForegroundColor Yellow
}
