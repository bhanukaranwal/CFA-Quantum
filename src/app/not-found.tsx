import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Page Not Found
          </CardTitle>
          <CardDescription>
            Sorry, we couldn't find the page you're looking for.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
            <p className="text-sm text-gray-600 mb-6">
              The page you requested doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button asChild variant="cfa" className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need help? Check our{' '}
              <Link href="/help" className="text-cfa-blue hover:underline">
                help center
              </Link>{' '}
              or{' '}
              <a 
                href="mailto:support@cfaquantum.com" 
                className="text-cfa-blue hover:underline"
              >
                contact support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
