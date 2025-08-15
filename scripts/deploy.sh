#!/bin/bash

# CFA Quantum Deployment Script
# Author: bhanukaranwal
# Date: 2025-08-14

set -e

echo "🚀 Starting CFA Quantum deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
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

# Check if required tools are installed
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        error "Node.js is required but not installed."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        error "npm is required but not installed."
        exit 1
    fi
    
    success "All dependencies are installed"
}

# Check environment variables
check_env() {
    log "Checking environment variables..."
    
    if [ -z "$DATABASE_URL" ]; then
        error "DATABASE_URL environment variable is required"
        exit 1
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ]; then
        error "NEXTAUTH_SECRET environment variable is required"
        exit 1
    fi
    
    success "Environment variables are set"
}

# Install dependencies
install_deps() {
    log "Installing dependencies..."
    npm ci --production=false
    success "Dependencies installed"
}

# Build application
build_app() {
    log "Building application..."
    npm run build
    success "Application built successfully"
}

# Generate database client
generate_db() {
    log "Generating database client..."
    npm run db:generate
    success "Database client generated"
}

# Run database migrations
migrate_db() {
    log "Running database migrations..."
    npm run db:migrate
    success "Database migrations completed"
}

# Run tests
run_tests() {
    log "Running tests..."
    npm run test --passWithNoTests
    success "Tests passed"
}

# Deploy to Netlify
deploy_netlify() {
    log "Deploying to Netlify..."
    
    if command -v netlify &> /dev/null; then
        netlify deploy --prod --dir=.next
        success "Deployed to Netlify"
    else
        warning "Netlify CLI not found. Skipping direct deployment."
        log "Please deploy manually via Netlify dashboard"
    fi
}

# Main deployment process
main() {
    log "🎯 CFA Quantum Deployment Started"
    
    check_dependencies
    check_env
    install_deps
    generate_db
    migrate_db
    build_app
    run_tests
    deploy_netlify
    
    success "🎉 Deployment completed successfully!"
    log "🌐 Your app should be live at: https://cfaquantum.netlify.app"
}

# Run main function
main "$@"