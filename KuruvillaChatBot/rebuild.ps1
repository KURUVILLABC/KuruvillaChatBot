#!/usr/bin/env pwsh

Write-Host "Rebuilding backend and frontend..." -ForegroundColor Cyan

# Save current location
$rootDir = Get-Location

# Build backend
Write-Host "Building backend..." -ForegroundColor Yellow
Set-Location "$rootDir\backend"
npm run build

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
Set-Location "$rootDir\frontend"
npm run build

# Return to root
Set-Location $rootDir
Write-Host "Build complete!" -ForegroundColor Green
