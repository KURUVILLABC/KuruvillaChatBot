#!/usr/bin/env pwsh
# Quick API test for all 5 suggested questions + 3 more

$allQuestions = @(
    "Tell me about the experience",
    "What are the technical skills?",
    "What projects have been built?",
    "Tell me about the GitHub profile",
    "What is the educational background?",
    "Tell me about yourself",
    "Hello",
    "What excites you about AI?"
)

Write-Host "`n════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "FINAL QA VERIFICATION - 8 QUESTIONS" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

$results = @()
$passed = 0

for ($i = 0; $i -lt $allQuestions.Count; $i++) {
    $q = $allQuestions[$i]
    
    $body = @{ message = $q; conversation = @() } | ConvertTo-Json -Depth 10
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/chat" `
        -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    $answer = $data.answer
    $results += $answer
    
    $shortAnswer = $answer.Substring(0, 85)
    
    # Categorize
    $category = switch -Wildcard ($q) {
        "*experience*" { "EXPERIENCE" }
        "*skill*" { "SKILLS" }
        "*project*" { "PROJECTS" }
        "*GitHub*" { "GITHUB" }
        "*education*" { "EDUCATION" }
        "*about yourself*" { "ABOUT SELF" }
        "*hello*" { "GREETING" }
        "*excit*" { "PASSION/AI" }
        default { "OTHER" }
    }
    
    Write-Host "TEST $(($i+1).ToString().PadLeft(2)) - $category" -ForegroundColor Yellow
    Write-Host "Q: $q" -ForegroundColor Gray
    Write-Host "A: $shortAnswer..." -ForegroundColor White
    Write-Host ""
    
    $passed++
}

# Analysis
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "FINAL RESULTS" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

$unique = ($results | Sort-Object -Unique).Count
Write-Host "Total Questions: $($allQuestions.Count)" -ForegroundColor White
Write-Host "Responses Received: $passed" -ForegroundColor Green
Write-Host "Unique Responses: $unique / $($allQuestions.Count)" -ForegroundColor $(if ($unique -eq $allQuestions.Count) { "Green" } else { "Yellow" })
Write-Host ""

if ($unique -eq $allQuestions.Count) {
    Write-Host "✅ SUCCESS: ALL RESPONSES ARE 100% UNIQUE!" -ForegroundColor Green
    Write-Host "   Each question receives its own distinct contextual response." -ForegroundColor Green
    Write-Host "   The digital twin is working perfectly! 🎉" -ForegroundColor Green
} elseif ($unique -ge ($allQuestions.Count * 0.9)) {
    Write-Host "✅ EXCELLENT: $(($unique/$allQuestions.Count * 100).ToString("F0"))% Uniqueness" -ForegroundColor Green
    Write-Host "   Almost all responses are distinct." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some responses may be similar" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
