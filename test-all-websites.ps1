# PowerShell script to test all websites 3-10
# Installs dependencies and tests health endpoints

$RepoRoot = "C:\Users\sbaranwal\Claude\mock websites\Revere"
$WebsiteNumbers = @(3, 4, 5, 6, 7, 8, 9, 10)
$HealthCheckResults = @()

Write-Host "================================"
Write-Host "Installing Dependencies"
Write-Host "================================"

foreach ($num in $WebsiteNumbers) {
    $websitePath = "$RepoRoot\website $num"
    Write-Host "Installing dependencies for website $num..."

    # Install npm dependencies
    Push-Location $websitePath
    npm install 2>&1 | Out-Null
    Pop-Location

    Write-Host "[OK] Website $num dependencies installed"
}

Write-Host ""
Write-Host "================================"
Write-Host "Starting Website Servers"
Write-Host "================================"
Write-Host ""

# Start each website server in the background
$processes = @()
$ports = @{
    3 = 3003
    4 = 3004
    5 = 3005
    6 = 3006
    7 = 3007
    8 = 3008
    9 = 3009
    10 = 3010
}

foreach ($num in $WebsiteNumbers) {
    $websitePath = "$RepoRoot\website $num"
    $port = $ports[$num]

    Write-Host "Starting website $num (port $port)..."

    # Start the server in background
    $process = Start-Process -WorkingDirectory $websitePath -FilePath "node" -ArgumentList "server.js" -PassThru -WindowStyle Hidden
    $processes += $process

    Write-Host "[OK] Website $num started (PID $($process.Id))"
}

# Wait for servers to be ready
Write-Host ""
Write-Host "Waiting for servers to start (5 seconds)..."
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "================================"
Write-Host "Testing Health Endpoints"
Write-Host "================================"
Write-Host ""

$failedTests = @()

foreach ($num in $WebsiteNumbers) {
    $port = $ports[$num]
    $url = "http://localhost:$port/health"

    Write-Host "Testing website $num at $url..."

    try {
        $response = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop

        if ($response.status -eq "ok") {
            Write-Host "[PASS] Website $num - Health check passed"
            Write-Host "  Company: $($response.company)"
            Write-Host "  Navigation Depth $($response.navigationDepth)"
            Write-Host "  Features $($response.features | ConvertTo-Json -Compress)"
            Write-Host ""

            $HealthCheckResults += @{
                Website = "Website $num"
                Port = $port
                Status = "PASS"
                Company = $response.company
                Details = $response
            }
        } else {
            Write-Host "[FAIL] Website $num - Unexpected response status"
            $failedTests += "Website $num"
        }
    } catch {
        Write-Host "[FAIL] Website $num - Health check failed"
        Write-Host "  Error $($_.Exception.Message)"
        $failedTests += "Website $num"
    }
}

Write-Host ""
Write-Host "================================"
Write-Host "Test Summary"
Write-Host "================================"
Write-Host "Total websites tested $($WebsiteNumbers.Count)"
Write-Host "Passed $($HealthCheckResults.Count)"
Write-Host "Failed $($failedTests.Count)"

if ($failedTests.Count -gt 0) {
    Write-Host ""
    Write-Host "Failed tests"
    $failedTests | ForEach-Object { Write-Host "  - $_" }
}

Write-Host ""
Write-Host "================================"
Write-Host "Shutting Down Servers"
Write-Host "================================"
Write-Host ""

# Stop all processes
$processes | ForEach-Object {
    Stop-Process -InputObject $_ -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Stopped server (PID $($_.Id))"
}

Write-Host ""
Write-Host "================================"
Write-Host "Test Complete"
Write-Host "================================"

if ($failedTests.Count -eq 0) {
    Write-Host "All tests passed successfully!"
    exit 0
} else {
    Write-Host "Some tests failed. Please review the output above."
    exit 1
}
