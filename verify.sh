#!/bin/bash

# Farewell Diary - Verification Script
# This script helps verify that the application is properly configured

echo "================================================"
echo "  Farewell Diary - Configuration Verification"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ERRORS=0
WARNINGS=0

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "=== Checking Project Structure ==="
echo ""

# Check backend directory
if [ -d "backend" ]; then
    print_status 0 "Backend directory exists"
else
    print_status 1 "Backend directory missing"
fi

# Check frontend directory
if [ -d "frontend" ]; then
    print_status 0 "Frontend directory exists"
else
    print_status 1 "Frontend directory missing"
fi

echo ""
echo "=== Checking Backend Configuration ==="
echo ""

# Check backend package.json
if [ -f "backend/package.json" ]; then
    print_status 0 "Backend package.json exists"
else
    print_status 1 "Backend package.json missing"
fi

# Check backend .env.example
if [ -f "backend/.env.example" ]; then
    print_status 0 "Backend .env.example exists"
else
    print_status 1 "Backend .env.example missing"
fi

# Check backend .env
if [ -f "backend/.env" ]; then
    print_status 0 "Backend .env exists"
    
    # Check critical environment variables
    if grep -q "DATABASE_URL=" backend/.env; then
        print_status 0 "DATABASE_URL configured"
    else
        print_status 1 "DATABASE_URL not found in .env"
    fi
    
    if grep -q "SESSION_SECRET=" backend/.env; then
        print_status 0 "SESSION_SECRET configured"
    else
        print_status 1 "SESSION_SECRET not found in .env"
    fi
    
    if grep -q "GOOGLE_CLIENT_ID=" backend/.env; then
        print_status 0 "GOOGLE_CLIENT_ID configured"
    else
        print_status 1 "GOOGLE_CLIENT_ID not found in .env"
    fi
else
    print_warning "Backend .env not found (copy from .env.example)"
fi

# Check key backend files
BACKEND_FILES=(
    "backend/src/app.ts"
    "backend/src/index.ts"
    "backend/src/config/env.ts"
    "backend/src/routes/index.ts"
    "backend/src/db/schema.ts"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$(basename $file) exists"
    else
        print_status 1 "$(basename $file) missing"
    fi
done

echo ""
echo "=== Checking Frontend Configuration ==="
echo ""

# Check frontend package.json
if [ -f "frontend/package.json" ]; then
    print_status 0 "Frontend package.json exists"
else
    print_status 1 "Frontend package.json missing"
fi

# Check frontend .env.example
if [ -f "frontend/.env.example" ]; then
    print_status 0 "Frontend .env.example exists"
else
    print_status 1 "Frontend .env.example missing"
fi

# Check frontend .env.local
if [ -f "frontend/.env.local" ]; then
    print_status 0 "Frontend .env.local exists"
    
    if grep -q "VITE_API_URL=" frontend/.env.local; then
        print_status 0 "VITE_API_URL configured"
    else
        print_status 1 "VITE_API_URL not found in .env.local"
    fi
else
    print_warning "Frontend .env.local not found (copy from .env.example)"
fi

# Check key frontend files
FRONTEND_FILES=(
    "frontend/src/App.tsx"
    "frontend/src/main.tsx"
    "frontend/src/api/client.ts"
    "frontend/src/pages/Dashboard.tsx"
    "frontend/src/pages/ViewNotes.tsx"
    "frontend/src/pages/Profile.tsx"
)

for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$(basename $file) exists"
    else
        print_status 1 "$(basename $file) missing"
    fi
done

echo ""
echo "=== Checking API Client Configuration ==="
echo ""

# Check that old API files are removed
if [ ! -f "frontend/src/api/publicApi.ts" ]; then
    print_status 0 "Old publicApi.ts removed"
else
    print_status 1 "Old publicApi.ts still exists (should be removed)"
fi

if [ ! -f "frontend/src/api/userApi.ts" ]; then
    print_status 0 "Old userApi.ts removed"
else
    print_status 1 "Old userApi.ts still exists (should be removed)"
fi

if [ ! -f "frontend/src/api/diaryApi.ts" ]; then
    print_status 0 "Old diaryApi.ts removed"
else
    print_status 1 "Old diaryApi.ts still exists (should be removed)"
fi

# Check consolidated client.ts
if [ -f "frontend/src/api/client.ts" ]; then
    if grep -q "publicApiClient" frontend/src/api/client.ts; then
        print_status 0 "Consolidated client.ts has publicApiClient"
    else
        print_status 1 "client.ts missing publicApiClient"
    fi
    
    if grep -q "userApiClient" frontend/src/api/client.ts; then
        print_status 0 "Consolidated client.ts has userApiClient"
    else
        print_status 1 "client.ts missing userApiClient"
    fi
fi

echo ""
echo "=== Checking Documentation ==="
echo ""

DOCS=(
    "README.md"
    "DEVELOPMENT.md"
    "DEPLOYMENT.md"
    "FIXES.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        print_status 0 "$doc exists"
    else
        print_status 1 "$doc missing"
    fi
done

echo ""
echo "=== Checking Dependencies ==="
echo ""

# Check if node_modules exist
if [ -d "backend/node_modules" ]; then
    print_status 0 "Backend dependencies installed"
else
    print_warning "Backend dependencies not installed (run: cd backend && npm install)"
fi

if [ -d "frontend/node_modules" ]; then
    print_status 0 "Frontend dependencies installed"
else
    print_warning "Frontend dependencies not installed (run: cd frontend && npm install)"
fi

echo ""
echo "================================================"
echo "  Verification Complete"
echo "================================================"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ No errors found!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Configure environment variables (.env files)"
    echo "  2. Install dependencies (npm install)"
    echo "  3. Start development servers (npm run dev)"
    echo ""
    echo "See DEVELOPMENT.md for detailed instructions."
else
    echo -e "${RED}✗ Found $ERRORS error(s)${NC}"
    echo ""
    echo "Please fix the errors above before proceeding."
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $WARNINGS warning(s)${NC}"
    echo ""
    echo "Warnings indicate missing optional configurations."
fi

echo ""
exit $ERRORS
