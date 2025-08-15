#!/bin/bash

# CFA Quantum Production Build Script
# Author: bhanukaranwal
# Date: 2025-08-14

set -e

echo "🏗️ Starting CFA Quantum production build..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Check Node.js version
check_node_version() {
    log "Checking Node.js version..."
    
    NODE_VERSION=$(node --version)
    REQUIRED_VERSION="v18"
    
    if [[ $NODE_VERSION < $REQUIRED_VERSION ]]; then
        error "Node.js $REQUIRED_VERSION or higher is required. Current: $NODE_VERSION"
        exit 1
    fi
    
    success "Node.js version: $NODE_VERSION"
}

# Clean previous builds
clean_build() {
    log "Cleaning previous builds..."
    
    rm -rf .next
    rm -rf out
    rm -rf dist
    rm -rf node_modules/.cache
    
    success "Build directory cleaned"
}

# Install dependencies
install_dependencies() {
    log "Installing production dependencies..."
    
    npm ci --only=production=false
    
    success "Dependencies installed"
}

# Type checking
type_check() {
    log "Running TypeScript type checking..."
    
    npm run type-check
    
    success "Type checking passed"
}

# Linting
lint_code() {
    log "Running ESLint..."
    
    npm run lint
    
    success "Linting passed"
}

# Generate Prisma client
generate_prisma() {
    log "Generating Prisma client..."
    
    npm run db:generate
    
    success "Prisma client generated"
}

# Build application
build_app() {
    log "Building Next.js application..."
    
    # Set production environment
    export NODE_ENV=production
    
    npm run build
    
    success "Application built successfully"
}

# Optimize build
optimize_build() {
    log "Optimizing build..."
    
    # Check build size
    if [ -d ".next" ]; then
        BUILD_SIZE=$(du -sh .next | cut -f1)
        log "Build size: $BUILD_SIZE"
    fi
    
    success "Build optimization completed"
}

# Verify build
verify_build() {
    log "Verifying build integrity..."
    
    # Check if required files exist
    if [ ! -f ".next/BUILD_ID" ]; then
        error "Build ID file missing"
        exit 1
    fi
    
    if [ ! -d ".next/static" ]; then
        error "Static files directory missing"
        exit 1
    fi
    
    if [ ! -f ".next/server/app/page.js" ]; then
        error "Main page bundle missing"
        exit 1
    fi
    
    success "Build verification passed"
}

# Generate build info
generate_build_info() {
    log "Generating build information..."
    
    cat > .next/build-info.json << EOF
{
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "buildId": "$(cat .next/BUILD_ID)",
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
  "buildDuration": "$((SECONDS))s",
  "environment": "production"
}
EOF
    
    success "Build information generated"
}

# Main build process
main() {
    local start_time=$(date +%s)
    
    log "🎯 Starting production build process..."
    
    check_node_version
    clean_build
    install_dependencies
    type_check
    lint_code
    generate_prisma
    build_app
    optimize_build
    verify_build
    generate_build_info
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    success "🎉 Production build completed successfully!"
    log "🕒 Total build time: ${duration}s"
    log "📦 Build ready for deployment"
    
    # Display next steps
    echo ""
    echo "🚀 Next steps:"
    echo "  1. Test the build locally: npm start"
    echo "  2. Deploy to Netlify: npm run deploy"
    echo "  3. Monitor deployment: netlify open"
}

# Run main function
main "$@"