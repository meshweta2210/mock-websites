# PowerShell script to generate websites 3-10
# This script creates all 8 zodiac company websites with proper configuration

$RepoRoot = "C:\Users\sbaranwal\Claude\mock websites\Revere"
$Website2Path = "$RepoRoot\website 2"

# Website configuration mapping
$WebsiteConfig = @(
    @{
        num = 3
        company = 'pisces'
        displayName = 'Pisces Company'
        port = 3003
        navigationDepth = 1
        features = @{
            HAS_DYNAMIC_GENERATION = $true
            HAS_PAGINATION = $true
            HAS_JS_RENDERING = $true
            HAS_INCONSISTENT_HTML = $false
            HAS_RATE_LIMITING = $false
            HAS_REDIRECT_CHAINS = $false
        }
        rateLimitThreshold = 20
    }
    @{
        num = 4
        company = 'libra'
        displayName = 'Libra Company'
        port = 3004
        navigationDepth = 3
        features = @{
            HAS_DYNAMIC_GENERATION = $true
            HAS_INCONSISTENT_HTML = $true
            HAS_JS_RENDERING = $true
            HAS_PAGINATION = $false
            HAS_RATE_LIMITING = $false
            HAS_REDIRECT_CHAINS = $false
        }
        rateLimitThreshold = 25
    }
    @{
        num = 5
        company = 'scorpio'
        displayName = 'Scorpio Company'
        port = 3005
        navigationDepth = 2
        features = @{
            HAS_PAGINATION = $true
            HAS_RATE_LIMITING = $true
            HAS_REDIRECT_CHAINS = $true
            HAS_DYNAMIC_GENERATION = $false
            HAS_INCONSISTENT_HTML = $false
            HAS_JS_RENDERING = $false
        }
        rateLimitThreshold = 30
    }
    @{
        num = 6
        company = 'leo'
        displayName = 'Leo Company'
        port = 3006
        navigationDepth = 1
        features = @{
            HAS_DYNAMIC_GENERATION = $true
            HAS_RATE_LIMITING = $true
            HAS_PAGINATION = $false
            HAS_INCONSISTENT_HTML = $false
            HAS_JS_RENDERING = $false
            HAS_REDIRECT_CHAINS = $false
        }
        rateLimitThreshold = 35
    }
    @{
        num = 7
        company = 'virgo'
        displayName = 'Virgo Company'
        port = 3007
        navigationDepth = 3
        features = @{
            HAS_INCONSISTENT_HTML = $true
            HAS_PAGINATION = $true
            HAS_REDIRECT_CHAINS = $true
            HAS_DYNAMIC_GENERATION = $false
            HAS_RATE_LIMITING = $false
            HAS_JS_RENDERING = $false
        }
        rateLimitThreshold = 40
    }
    @{
        num = 8
        company = 'gemini'
        displayName = 'Gemini Company'
        port = 3008
        navigationDepth = 2
        features = @{
            HAS_JS_RENDERING = $true
            HAS_RATE_LIMITING = $true
            HAS_DYNAMIC_GENERATION = $false
            HAS_INCONSISTENT_HTML = $false
            HAS_PAGINATION = $false
            HAS_REDIRECT_CHAINS = $false
        }
        rateLimitThreshold = 45
    }
    @{
        num = 9
        company = 'aries'
        displayName = 'Aries Company'
        port = 3009
        navigationDepth = 1
        features = @{
            HAS_DYNAMIC_GENERATION = $true
            HAS_INCONSISTENT_HTML = $true
            HAS_PAGINATION = $true
            HAS_RATE_LIMITING = $false
            HAS_JS_RENDERING = $false
            HAS_REDIRECT_CHAINS = $false
        }
        rateLimitThreshold = 50
    }
    @{
        num = 10
        company = 'aquarius'
        displayName = 'Aquarius Company'
        port = 3010
        navigationDepth = 2
        features = @{
            HAS_DYNAMIC_GENERATION = $true
            HAS_INCONSISTENT_HTML = $true
            HAS_PAGINATION = $true
            HAS_RATE_LIMITING = $true
            HAS_JS_RENDERING = $true
            HAS_REDIRECT_CHAINS = $true
        }
        rateLimitThreshold = 55
    }
)

# Helper function to read a file as template and replace placeholders
function Create-WebsiteFiles {
    param(
        [int]$WebsiteNum,
        [string]$Company,
        [string]$DisplayName,
        [int]$Port,
        [int]$NavigationDepth,
        [hashtable]$Features,
        [int]$RateLimitThreshold
    )

    $websitePath = "$RepoRoot\website $WebsiteNum"

    # Create directory if it doesn't exist
    if (-not (Test-Path $websitePath)) {
        New-Item -ItemType Directory -Path $websitePath | Out-Null
        Write-Host "Created directory: $websitePath"
    }

    # Create package.json
    $packageJson = @{
        name = "$Company-mock-website"
        version = "1.0.0"
        description = "$DisplayName Mock Website for Web Scraping"
        main = "server.js"
        scripts = @{
            start = "node server.js"
            dev = "node server.js"
        }
        dependencies = @{
            express = "4.18.2"
            dotenv = "16.0.3"
        }
        engines = @{
            node = "18.x"
            npm = "9.x"
        }
    } | ConvertTo-Json -Depth 10

    Set-Content -Path "$websitePath\package.json" -Value $packageJson -Encoding UTF8
    Write-Host "Created package.json for website $WebsiteNum"

    # Create .env
    $envContent = @"
PORT=$Port
COMPANY_ID=$Company
NAVIGATION_DEPTH=$NavigationDepth
HAS_DYNAMIC_GENERATION=$($Features.HAS_DYNAMIC_GENERATION.ToString().ToLower())
HAS_INCONSISTENT_HTML=$($Features.HAS_INCONSISTENT_HTML.ToString().ToLower())
HAS_PAGINATION=$($Features.HAS_PAGINATION.ToString().ToLower())
HAS_RATE_LIMITING=$($Features.HAS_RATE_LIMITING.ToString().ToLower())
HAS_JS_RENDERING=$($Features.HAS_JS_RENDERING.ToString().ToLower())
HAS_REDIRECT_CHAINS=$($Features.HAS_REDIRECT_CHAINS.ToString().ToLower())
RATE_LIMIT_THRESHOLD=$RateLimitThreshold
"@

    Set-Content -Path "$websitePath\.env" -Value $envContent -Encoding UTF8
    Write-Host "Created .env for website $WebsiteNum"

    # Copy .gitignore
    Copy-Item -Path "$Website2Path\.gitignore" -Destination "$websitePath\.gitignore" -Force
    Write-Host "Copied .gitignore for website $WebsiteNum"

    # Copy press-release-data.js
    Copy-Item -Path "$Website2Path\press-release-data.js" -Destination "$websitePath\press-release-data.js" -Force
    Write-Host "Copied press-release-data.js for website $WebsiteNum"

    # Copy server.js
    Copy-Item -Path "$Website2Path\server.js" -Destination "$websitePath\server.js" -Force
    Write-Host "Copied server.js for website $WebsiteNum"
}

# Main execution
Write-Host "================================"
Write-Host "Generating Mock Websites 3-10"
Write-Host "================================"

foreach ($config in $WebsiteConfig) {
    Write-Host "`nCreating Website $($config.num) ($($config.displayName))..."
    Create-WebsiteFiles -WebsiteNum $config.num `
                        -Company $config.company `
                        -DisplayName $config.displayName `
                        -Port $config.port `
                        -NavigationDepth $config.navigationDepth `
                        -Features $config.features `
                        -RateLimitThreshold $config.rateLimitThreshold
}

Write-Host "`n================================"
Write-Host "All websites created successfully!"
Write-Host "================================"
