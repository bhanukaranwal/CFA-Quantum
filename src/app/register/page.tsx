'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useRegisterForm } from '@/hooks/use-form'
import { Eye, EyeOff, BookOpen, Github, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)

  const form = useRegisterForm(async (data) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: result.error || 'An error occurred during registration.',
      })
      return
    }

    toast({
      variant: 'success',
      title: 'Account Created!',
      description: 'Your account has been created successfully. Please sign in.',
    })

    router.push('/login?message=registration-success')
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-cfa-blue rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Join CFA Quantum</CardTitle>
          <CardDescription>
            Create your account and start your CFA preparation journey today
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Registration */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isGoogleLoading ? 'Creating account...' : 'Continue with Google'}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGithubSignIn}
              disabled={isGithubLoading}
            >
              <Github className="h-4 w-4 mr-2" />
              {isGithubLoading ? 'Creating account...' : 'Continue with GitHub'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or register with email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={form.data.name}
                onChange={(e) => form.handleChange('name', e.target.value)}
                disabled={form.isLoading}
                required
              />
              {form.errors.name && (
                <p className="text-sm text-destructive">{form.errors.name}</p>
              )}
            </div>

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
                  placeholder="Create a strong password"
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
                </Button>
              </div>
              {form.errors.password && (
                <p className="text-sm text-destructive">{form.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={form.data.confirmPassword}
                  onChange={(e) => form.handleChange('confirmPassword', e.target.value)}
                  disabled={form.isLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={form.isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.errors.confirmPassword && (
                <p className="text-sm text-destructive">{form.errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cfaLevel">CFA Level</Label>
              <Select
                value={form.data.cfaLevel}
                onValueChange={(value) => form.handleChange('cfaLevel', value)}
                disabled={form.isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your CFA level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEVEL_1">Level I</SelectItem>
                  <SelectItem value="LEVEL_2">Level II</SelectItem>
                  <SelectItem value="LEVEL_3">Level III</SelectItem>
                </SelectContent>
              </Select>
              {form.errors.cfaLevel && (
                <p className="text-sm text-destructive">{form.errors.cfaLevel}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={form.data.experienceLevel}
                onValueChange={(value) => form.handleChange('experienceLevel', value)}
                disabled={form.isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
              {form.errors.experienceLevel && (
                <p className="text-sm text-destructive">{form.errors.experienceLevel}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studyHoursPerWeek">Study Hours Per Week</Label>
              <Input
                id="studyHoursPerWeek"
                type="number"
                min="1"
                max="80"
                placeholder="15"
                value={form.data.studyHoursPerWeek}
                onChange={(e) => form.handleChange('studyHoursPerWeek', parseInt(e.target.value) || 0)}
                disabled={form.isLoading}
                required
              />
              {form.errors.studyHoursPerWeek && (
                <p className="text-sm text-destructive">{form.errors.studyHoursPerWeek}</p>
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
              {form.isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              href="/login"
              className="text-cfa-blue hover:underline font-medium"
            >
              Sign in here
            </Link>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-cfa-blue hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-cfa-blue hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}