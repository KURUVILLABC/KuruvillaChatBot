#!/usr/bin/env pwsh
# QA Test Script - Response Variation Verification

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "QA TEST #2 - COMPREHENSIVE RESPONSE VARIATION" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$tests = @(
    @{
        num = 1
        q = "What are your technical skills?"
        expected_keyword = "TypeScript"
    },
    @{
        num = 2
        q = "Tell me about your work experience"
        expected_keyword = "roles"
    },
    @{
        num = 3
        q = "Tell me about yourself"
        expected_keyword = "Kuruvilla"
    },
    @{
        num = 4
        q = "Show me your GitHub projects"
        expected_keyword = "GitHub"
    },
    @{
        num = 5
        q = "What's your passion in tech?"
        expected_keyword = "passionate"
    }
)

$responses = @()
$passed = 0

foreach ($test in $tests) {
    $body = @{ 
        message = $test.q
        conversation = @()
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/chat" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -UseBasicParsing `
            -TimeoutSec 10
        
        $data = $response.Content | ConvertFrom-Json
        $answer = $data.answer
        $responses += $answer
        
        # Check if response contains expected keyword
        $hasKeyword = $answer -match $test.expected_keyword
        $status = if ($hasKeyword) { "✅" } else { "⚠️" }
        
        Write-Host "TEST $($test.num) $status" -ForegroundColor Yellow
        Write-Host "Q: $($test.q)"
        Write-Host "A: $($answer.Substring(0, 95))..."
        Write-Host ""
        
        if ($hasKeyword) { $passed++ }
    } catch {
        Write-Host "TEST $($test.num) ❌ ERROR" -ForegroundColor Red
        Write-Host "Q: $($test.q)"
        Write-Host "Error: $($_.Exception.Message)"
        Write-Host ""
    }
}

# Verify uniqueness
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "VARIATION VERIFICATION" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if ($responses.Count -gt 0) {
    $unique = ($responses | Sort-Object -Unique).Count
    $total = $responses.Count
    
    Write-Host "Total responses: $total"
    Write-Host "Unique responses: $unique"
    Write-Host "Keywords found: $passed / $total"
    Write-Host ""
    
    if ($unique -eq $total) {
        Write-Host "✅ SUCCESS: ALL RESPONSES ARE UNIQUE!" -ForegroundColor Green
        Write-Host "   The digital twin is responding contextually to each question." -ForegroundColor Green
    } else {
        Write-Host "⚠️  WARNING: Some responses appear similar" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ ERROR: No responses received" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test run complete." -ForegroundColor Cyan
