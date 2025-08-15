#!/bin/bash

echo "🚀 Deploying CFA Quantum to Production..."
echo "Build Date: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "Developer: bhanukaranwal"

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

# Check if required environment variables are set
print_status "Checking environment variables..."
required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Environment variable $var is not set"
        exit 1
    fi
done
print_success "Environment variables check passed"

# Clean install dependencies
print_status "Installing dependencies..."
rm -rf node_modules package-lock.json
npm cache clean --force
npm ci --only=production
print_success "Dependencies installed"

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate
print_success "Prisma client generated"

# Run database migrations
print_status "Running database migrations..."
npx prisma migrate deploy
print_success "Database migrations completed"

# Type checking
print_status "Running TypeScript type check..."
npm run type-check
print_success "Type check passed"

# Linting
print_status "Running ESLint..."
npm run lint
print_success "Linting passed"

# Build the application
print_status "Building application..."
npm run build
print_success "Application built successfully"

# Run basic tests (if available)
if [ -f "jest.config.js" ]; then
    print_status "Running tests..."
    npm test
    print_success "Tests passed"
fi

print_success "🎉 CFA Quantum deployment completed successfully!"
print_status "Application is ready for production use"

# Display deployment summary
echo ""
echo "📋 Deployment Summary:"
echo "   - Platform: Next.js 14.1.0"
echo "   - Database: PostgreSQL with Prisma"
echo "   - Authentication: NextAuth.js"
echo "   - Styling: Tailwind CSS"
echo "   - Deployment: Netlify"
echo "   - Build Time: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""
echo "🌐 Next Steps:"
echo "   1. Set up environment variables in Netlify"
echo "   2. Configure custom domain (if applicable)"
echo "   3. Set up monitoring and analytics"
echo "   4. Test all features in production"
echo ""