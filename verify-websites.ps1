# PowerShell script to verify all websites 3-10 have correct configuration

$RepoRoot = "C:\Users\sbaranwal\Claude\mock websites\Revere"
$WebsiteNumbers = @(3, 4, 5, 6, 7, 8, 9, 10)

# Expected configuration for each website
$ExpectedConfig = @{
    3 = @{
        Company = "pisces"
        Port = 3003
        NavigationDepth = 1
        Features = @{
            HAS_DYNAMIC_GENERATION = $true
            HAS_PAGINATION = $true
            HAS_JS_RENDERING = $true
            HAS_INCONSISTENT_HTML = $false
            HAS_RATE_LIMITING = $false
            HAS_REDIRECT_CHAINS = $false
        }
        RateLimitThreshold = 20
    }
    4 = @{
        Company = "libra"
        Port = 3004
        NavigationDepth = 3
        Features = @{
            HAS_DYNAMIC_GENERATION = $true
            HAS_INCONSISTENT_HTML = $true
            HAS_JS_RENDERING = $true
            HAS_PAGINATION = $false
            HAS_RATE_LIMITING = $false
            HAS_REDIRECT_CHAINS = $false
        }
        RateLimitThreshold = 25
    }
    5 = @{
        Company = "scorpio"
        Port = 3005
        NavigationDepth = 2
        Features = @{
            HAS_PAGINATION = $true
            HAS_RATE_LIMITING = $true
            HAS_REDIRECT_CHAINS = $true
            HAS_DYNAMIC_GENERATION = $false
            HAS_INCONSISTENT_HTML = $false
            HAS_JS_RENDERING = $false
        }
        RateLimitThreshold = 30
    }
    6 = @{
        Company = "leo"
        Port = 3006
        NavigationDepth = 1
        Features = @{
            HAS_DYNAMIC_GENERATION = $true
            HAS_RATE_LIMITING = $true
            HAS_PAGINATION = $false
            HAS_INCONSISTENT_HTML = $false
            HAS_JS_RENDERING = $false
            HAS_REDIRECT_CHAINS = $false
        }
        RateLimitThreshold = 35
    }
    7 = @{
        Company = "virgo"
        Port = 3007
        NavigationDepth = 3
        Features = @{
            HAS_INCONSISTENT_HTML = $true
            HAS_PAGINATION = $true
            HAS_REDIRECT_CHAINS = $true
            HAS_DYNAMIC_GENERATION = $false
            HAS_RATE_LIMITING = $false
            HAS_JS_RENDERING = $false
        }
        RateLimitThreshold = 40
    }
    8 = @{
        Company = "gemini"
        Port = 3008
        NavigationDepth = 2
        Features = @{
            HAS_JS_RENDERING = $true
            HAS_RATE_LIMITING = $true
            HAS_DYNAMIC_GENERATION = $false
            HAS_INCONSISTENT_HTML = $false
            HAS_PAGINATION = $false
            HAS_REDIRECT_CHAINS = $false
        }
        RateLimitThreshold = 45
    }
    9 = @{
        Company = "aries"
        Port = 3009
        NavigationDepth = 1
        Features = @{
            HAS_DYNAMIC_GENERATION = $true
            HAS_INCONSISTENT_HTML = $true
            HAS_PAGINATION = $true
            HAS_RATE_LIMITING = $false
            HAS_JS_RENDERING = $false
            HAS_REDIRECT_CHAINS = $false
        }
        RateLimitThreshold = 50
    }
    10 = @{
        Company = "aquarius"
        Port = 3010
        NavigationDepth = 2
        Features = @{
            HAS_DYNAMIC_GENERATION = $true
            HAS_INCONSISTENT_HTML = $true
            HAS_PAGINATION = $true
            HAS_RATE_LIMITING = $true
            HAS_JS_RENDERING = $true
            HAS_REDIRECT_CHAINS = $true
        }
        RateLimitThreshold = 55
    }
}

Write-Host "================================"
Write-Host "Verifying Website Configurations"
Write-Host "================================"
Write-Host ""

$VerificationResults = @()
$AllValid = $true

foreach ($num in $WebsiteNumbers) {
    $websitePath = "$RepoRoot\website $num"
    $envFile = "$websitePath\.env"
    $packageFile = "$websitePath\package.json"
    $serverFile = "$websitePath\server.js"
    $prDataFile = "$websitePath\press-release-data.js"
    $gitignoreFile = "$websitePath\.gitignore"

    Write-Host "Website $num ($($ExpectedConfig[$num].Company)):"

    # Check if all files exist
    $filesExist = @(
        (Test-Path $envFile),
        (Test-Path $packageFile),
        (Test-Path $serverFile),
        (Test-Path $prDataFile),
        (Test-Path $gitignoreFile)
    )

    if ($filesExist -contains $false) {
        Write-Host "  [FAIL] Missing required files"
        $AllValid = $false
        continue
    }

    Write-Host "  [OK] All required files exist"

    # Verify .env content
    $envContent = Get-Content $envFile -Raw
    $expected = $ExpectedConfig[$num]

    $envChecks = @(
        ("PORT=$($expected.Port)", "PORT"),
        ("COMPANY_ID=$($expected.Company)", "COMPANY_ID"),
        ("NAVIGATION_DEPTH=$($expected.NavigationDepth)", "NAVIGATION_DEPTH"),
        ("HAS_DYNAMIC_GENERATION=$($expected.Features.HAS_DYNAMIC_GENERATION.ToString().ToLower())", "HAS_DYNAMIC_GENERATION"),
        ("HAS_INCONSISTENT_HTML=$($expected.Features.HAS_INCONSISTENT_HTML.ToString().ToLower())", "HAS_INCONSISTENT_HTML"),
        ("HAS_PAGINATION=$($expected.Features.HAS_PAGINATION.ToString().ToLower())", "HAS_PAGINATION"),
        ("HAS_RATE_LIMITING=$($expected.Features.HAS_RATE_LIMITING.ToString().ToLower())", "HAS_RATE_LIMITING"),
        ("HAS_JS_RENDERING=$($expected.Features.HAS_JS_RENDERING.ToString().ToLower())", "HAS_JS_RENDERING"),
        ("HAS_REDIRECT_CHAINS=$($expected.Features.HAS_REDIRECT_CHAINS.ToString().ToLower())", "HAS_REDIRECT_CHAINS"),
        ("RATE_LIMIT_THRESHOLD=$($expected.RateLimitThreshold)", "RATE_LIMIT_THRESHOLD")
    )

    $allEnvValid = $true
    foreach ($check in $envChecks) {
        if ($envContent -contains $check[0]) {
            Write-Host "    [OK] $($check[1]) correct"
        } else {
            Write-Host "    [FAIL] $($check[1]) missing or incorrect"
            $allEnvValid = $false
            $AllValid = $false
        }
    }

    # Verify package.json
    $packageContent = Get-Content $packageFile | ConvertFrom-Json
    if ($packageContent.name -eq "$($expected.Company)-mock-website") {
        Write-Host "  [OK] package.json name correct"
    } else {
        Write-Host "  [FAIL] package.json name incorrect"
        $AllValid = $false
    }

    # Check for required node modules (dependencies are listed)
    if ($packageContent.dependencies.express -and $packageContent.dependencies.dotenv) {
        Write-Host "  [OK] package.json dependencies defined"
    } else {
        Write-Host "  [FAIL] package.json dependencies missing"
        $AllValid = $false
    }

    Write-Host ""
}

Write-Host "================================"
Write-Host "Verification Summary"
Write-Host "================================"

if ($AllValid) {
    Write-Host "All website configurations are correct!"
    Write-Host ""
    Write-Host "Summary of created websites:"
    Write-Host ""
    foreach ($num in $WebsiteNumbers) {
        $expected = $ExpectedConfig[$num]
        $activeFeatures = @()
        foreach ($feature in $expected.Features.Keys) {
            if ($expected.Features[$feature]) {
                $activeFeatures += $feature
            }
        }
        Write-Host "Website $num ($($expected.Company))"
        Write-Host "  Port: $($expected.Port)"
        Write-Host "  Navigation Depth: $($expected.NavigationDepth)"
        Write-Host "  Rate Limit Threshold: $($expected.RateLimitThreshold)"
        Write-Host "  Features: $($activeFeatures -join ', ')"
        Write-Host ""
    }
    exit 0
} else {
    Write-Host "Some website configurations are incorrect. Please review the output above."
    exit 1
}
