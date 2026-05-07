#!/bin/bash

# Test all websites 3-10
REPO_ROOT="/c/Users/sbaranwal/Claude/mock websites/Revere"
WEBSITES=(3 4 5 6 7 8 9 10)
PORTS=(3003 3004 3005 3006 3007 3008 3009 3010)
COMPANIES=("pisces" "libra" "scorpio" "leo" "virgo" "gemini" "aries" "aquarius")

echo "================================"
echo "Installing Dependencies"
echo "================================"

for i in "${!WEBSITES[@]}"; do
    num=${WEBSITES[$i]}
    website_path="$REPO_ROOT/website $num"
    echo "Installing dependencies for website $num..."

    cd "$website_path"
    npm install > /dev/null 2>&1
    echo "[OK] Website $num dependencies installed"
done

echo ""
echo "================================"
echo "Starting Website Servers"
echo "================================"
echo ""

# Start each website server
PIDS=()
for i in "${!WEBSITES[@]}"; do
    num=${WEBSITES[$i]}
    port=${PORTS[$i]}
    website_path="$REPO_ROOT/website $num"

    echo "Starting website $num (port $port)..."
    cd "$website_path"
    node server.js > /tmp/website-$num.log 2>&1 &
    pid=$!
    PIDS+=($pid)
    echo "[OK] Website $num started (PID $pid)"
done

echo ""
echo "Waiting for servers to start (3 seconds)..."
sleep 3

echo ""
echo "================================"
echo "Testing Health Endpoints"
echo "================================"
echo ""

PASSED=0
FAILED=0
FAILED_TESTS=""

for i in "${!WEBSITES[@]}"; do
    num=${WEBSITES[$i]}
    port=${PORTS[$i]}
    company=${COMPANIES[$i]}
    url="http://localhost:$port/health"

    echo "Testing website $num at $url..."

    response=$(curl -s "$url" 2>/dev/null || echo "")

    if [[ $response == *'"status":"ok"'* ]]; then
        echo "[PASS] Website $num - Health check passed"
        echo "  Company: $company"
        echo "  Response: $response"
        echo ""
        ((PASSED++))
    else
        echo "[FAIL] Website $num - Health check failed"
        echo "  Error: Could not connect or invalid response"
        echo ""
        ((FAILED++))
        FAILED_TESTS="$FAILED_TESTS Website $num"
    fi
done

echo ""
echo "================================"
echo "Test Summary"
echo "================================"
echo "Total websites tested: ${#WEBSITES[@]}"
echo "Passed: $PASSED"
echo "Failed: $FAILED"

if [ $FAILED -gt 0 ]; then
    echo ""
    echo "Failed tests:"
    for test in $FAILED_TESTS; do
        echo "  - $test"
    done
fi

echo ""
echo "================================"
echo "Shutting Down Servers"
echo "================================"
echo ""

for pid in "${PIDS[@]}"; do
    kill $pid 2>/dev/null
    echo "[OK] Stopped server (PID $pid)"
done

echo ""
echo "================================"
echo "Test Complete"
echo "================================"

if [ $FAILED -eq 0 ]; then
    echo "All tests passed successfully!"
    exit 0
else
    echo "Some tests failed. Check logs in /tmp/website-*.log"
    exit 1
fi
