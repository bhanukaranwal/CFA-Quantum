import { Wifi, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Wifi className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            You're Offline
          </CardTitle>
          <CardDescription className="text-gray-600">
            It looks like you've lost your internet connection. Don't worry, you can still access some features!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What you can still do:</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Review previously loaded questions</li>
              <li>• Access your study notes</li>
              <li>• View your progress dashboard</li>
              <li>• Browse flashcards you've seen before</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
              variant="cfa"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Link>
            </Button>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>
              Once you're back online, all your progress will sync automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}