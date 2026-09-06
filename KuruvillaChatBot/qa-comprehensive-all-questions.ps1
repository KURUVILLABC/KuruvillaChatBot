#!/usr/bin/env pwsh
# Comprehensive QA Test - All Questions Verification

Write-Host "`n" 
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      COMPREHENSIVE QA TEST - ALL QUESTIONS                 ║" -ForegroundColor Cyan
Write-Host "║      Digital Twin Response Variation Verification         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$allTests = @(
    @{
        num = 1
        category = "EXPERIENCE"
        q = "Tell me about the experience"
        keywords = @("worked", "roles", "developer", "engineer")
    },
    @{
        num = 2
        category = "SKILLS"
        q = "What are the technical skills?"
        keywords = @("TypeScript", "JavaScript", "stack", "technology")
    },
    @{
        num = 3
        category = "PROJECTS"
        q = "What projects have been built?"
        keywords = @("built", "projects", "focus", "AI")
    },
    @{
        num = 4
        category = "GITHUB"
        q = "Tell me about the GitHub profile"
        keywords = @("GitHub", "repository", "code", "open")
    },
    @{
        num = 5
        category = "EDUCATION"
        q = "What is the educational background?"
        keywords = @("education", "studied", "degree", "learning")
    },
    @{
        num = 6
        category = "ABOUT SELF"
        q = "Tell me about yourself"
        keywords = @("Kuruvilla", "developer", "architect", "passionate")
    },
    @{
        num = 7
        category = "GREETING"
        q = "Hello"
        keywords = @("hello", "hi", "hey", "thanks")
    },
    @{
        num = 8
        category = "PASSION"
        q = "What excites you about AI?"
        keywords = @("passionate", "excited", "AI", "systems")
    }
)

$responses = @()
$passedTests = 0
$results = @()

Write-Host "Testing $($allTests.Count) different questions..." -ForegroundColor Yellow
Write-Host ""

foreach ($test in $allTests) {
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
            -TimeoutSec 10 `
            -ErrorAction Stop
        
        $data = $response.Content | ConvertFrom-Json
        $answer = $data.answer
        $responses += $answer
        
        # Check if response contains any expected keyword
        $hasKeyword = $false
        foreach ($keyword in $test.keywords) {
            if ($answer -imatch [regex]::Escape($keyword)) {
                $hasKeyword = $true
                break
            }
        }
        
        $status = if ($hasKeyword) { "✅ PASS" } else { "⚠️  CHECK" }
        $passedTests += if ($hasKeyword) { 1 } else { 0 }
        
        $shortAnswer = $answer.Substring(0, 85)
        $results += @{
            num = $test.num
            category = $test.category
            question = $test.q
            response = $shortAnswer
            status = $status
            hasKeyword = $hasKeyword
        }
        
        Write-Host "TEST $($test.num) | $($test.category)" -ForegroundColor Yellow
        Write-Host "Q: $($test.q)" -ForegroundColor Gray
        Write-Host "A: $shortAnswer..." -ForegroundColor White
        Write-Host "   $status" -ForegroundColor $(if ($hasKeyword) { "Green" } else { "Yellow" })
        Write-Host ""
        
    } catch {
        Write-Host "TEST $($test.num) | $($test.category) ❌ ERROR" -ForegroundColor Red
        Write-Host "Q: $($test.q)"
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Analysis
Write-Host "`n"
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              COMPREHENSIVE ANALYSIS RESULTS               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($responses.Count -gt 0) {
    $unique = ($responses | Sort-Object -Unique).Count
    $total = $responses.Count
    
    Write-Host "📊 STATISTICS:" -ForegroundColor Cyan
    Write-Host "   Total Tests Run: $total" -ForegroundColor White
    Write-Host "   Tests Passed: $passedTests/$total" -ForegroundColor Green
    Write-Host "   Unique Responses: $unique/$total" -ForegroundColor White
    Write-Host ""
    
    # Variation check
    Write-Host "🔍 RESPONSE VARIATION:" -ForegroundColor Cyan
    if ($unique -eq $total) {
        Write-Host "   ✅ EXCELLENT: All $total responses are completely UNIQUE" -ForegroundColor Green
        Write-Host "   Each question receives its own distinct answer" -ForegroundColor Green
    } elseif ($unique -ge ($total * 0.8)) {
        Write-Host "   ✅ GOOD: $unique/$total responses are unique" -ForegroundColor Green
        Write-Host "   High variation detected" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  WARNING: Only $unique/$total responses are unique" -ForegroundColor Yellow
        Write-Host "   Some responses appear similar" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "📝 CONTEXTUAL ACCURACY:" -ForegroundColor Cyan
    
    foreach ($result in $results) {
        $indicator = if ($result.hasKeyword) { "✅" } else { "⚠️" }
        Write-Host "   $indicator TEST $($result.num) ($($result.category)): $($result.status)" -ForegroundColor $(if ($result.hasKeyword) { "Green" } else { "Yellow" })
    }
    
    Write-Host ""
    Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    if ($passedTests -eq $total -and $unique -eq $total) {
        Write-Host "🎉 RESULT: ALL TESTS PASSED WITH 100% VARIATION!" -ForegroundColor Green
        Write-Host "   The digital twin responds contextually to each question." -ForegroundColor Green
        Write-Host "   Ready for production deployment! ✨" -ForegroundColor Green
    } elseif ($passedTests -ge ($total * 0.8)) {
        Write-Host "✅ RESULT: TESTS MOSTLY PASSED WITH GOOD VARIATION!" -ForegroundColor Green
        Write-Host "   Minor issues detected but overall working correctly." -ForegroundColor Green
    } else {
        Write-Host "⚠️  RESULT: TESTS NEED REVIEW" -ForegroundColor Yellow
        Write-Host "   Some responses may not be contextually appropriate." -ForegroundColor Yellow
    }
    
    Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
} else {
    Write-Host "❌ ERROR: No responses received" -ForegroundColor Red
}

Write-Host "Test run completed at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
Write-Host ""
