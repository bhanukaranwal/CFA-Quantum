'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useLoginForm } from '@/hooks/use-form'
import { Eye, EyeOff, Github, Mail, BookOpen } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)

  const form = useLoginForm(async (data) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
      })
      return
    }

    if (result?.ok) {
      toast({
        variant: 'success',
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      })

      // Get fresh session and redirect
      const session = await getSession()
      if (session) {
        router.push('/dashboard')
        router.refresh()
      }
    }
  })

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign in with Google. Please try again.',
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true)
    try {
      await signIn('github', { callbackUrl: '/dashboard' })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign in with GitHub. Please try again.',
      })
    } finally {
      setIsGithubLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-cfa-blue rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your CFA Quantum account to continue your preparation journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Login */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGithubSignIn}
              disabled={isGithubLoading}
            >
              <Github className="h-4 w-4 mr-2" />
              {isGithubLoading ? 'Signing in...' : 'Continue with GitHub'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={form.data.email}
                onChange={(e) => form.handleChange('email', e.target.value)}
                disabled={form.isLoading}
                required
              />
              {form.errors.email && (
                <p className="text-sm text-destructive">{form.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.data.password}
                  onChange={(e) => form.handleChange('password', e.target.value)}
                  disabled={form.isLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={form.isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
              {form.errors.password && (
                <p className="text-sm text-destructive">{form.errors.password}</p>
              )}
            </div>

            {form.errors.submit && (
              <Alert variant="destructive">
                <AlertDescription>{form.errors.submit}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={form.isLoading || !form.isValid}
            >
              {form.isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <Link
              href="/forgot-password"
              className="text-cfa-blue hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <Separator />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              href="/register"
              className="text-cfa-blue hover:underline font-medium"
            >
              Sign up for free
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}