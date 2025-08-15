'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Github, Chrome, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  cfaLevel: string
  targetExamDate: string
  experienceLevel: string
  studyHoursPerWeek: number
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cfaLevel: 'LEVEL_1',
    targetExamDate: '',
    experienceLevel: 'BEGINNER',
    studyHoursPerWeek: 15,
    agreeToTerms: false,
    subscribeNewsletter: true
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  const { toast } = useToast()

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required'
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters'
      }
      
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid'
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number'
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    
    if (step === 2) {
      if (!formData.cfaLevel) {
        newErrors.cfaLevel = 'Please select your CFA level'
      }
      
      if (!formData.targetExamDate) {
        newErrors.targetExamDate = 'Please select your target exam date'
      }
      
      if (!formData.experienceLevel) {
        newErrors.experienceLevel = 'Please select your experience level'
      }
      
      if (formData.studyHoursPerWeek < 1 || formData.studyHoursPerWeek > 100) {
        newErrors.studyHoursPerWeek = 'Study hours must be between 1 and 100'
      }
    }
    
    if (step === 3) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
    setErrors({})
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          cfaLevel: formData.cfaLevel,
          targetExamDate: formData.targetExamDate,
          experienceLevel: formData.experienceLevel,
          studyHoursPerWeek: formData.studyHoursPerWeek,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to CFA Quantum. You can now sign in.",
          variant: "success",
        })
        
        // Auto-login after successful registration
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })
        
        if (signInResult?.ok) {
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      } else {
        toast({
          title: "Registration failed",
          description: data.message || "An error occurred during registration.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error(`${provider} registration error:`, error)
      toast({
        title: "Error",
        description: `Failed to register with ${provider}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getStepProgress = () => (currentStep / 3) * 100

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-cfa-blue to-cfa-gold rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">CQ</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-gray-600 mt-1">
          Join thousands preparing for CFA success
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Step {currentStep} of 3
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Basic information"}
                {currentStep === 2 && "Study preferences"}
                {currentStep === 3 && "Final details"}
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(getStepProgress())}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-cfa-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Social Registration */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  variant="outline"
                  onClick={() => handleSocialRegister('google')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialRegister('github')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or register with email
                  </span>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                  autoComplete="name"
                  autoFocus
                />
                {errors.name && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className={errors.password ? 'border-red-500' : ''}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Must contain uppercase, lowercase, and number
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Study Preferences */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Tell us about your CFA journey</h3>
                <p className="text-sm text-gray-600">
                  This helps us personalize your experience
                </p>
              </div>

              {/* CFA Level */}
              <div className="space-y-2">
                <Label htmlFor="cfaLevel">Which CFA level are you preparing for?</Label>
                <Select
                  value={formData.cfaLevel}
                  onValueChange={(value) => updateFormData('cfaLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LEVEL_1">Level 1</SelectItem>
                    <SelectItem value="LEVEL_2">Level 2</SelectItem>
                    <SelectItem value="LEVEL_3">Level 3</SelectItem>
                  </SelectContent>
                </Select>
                {errors.cfaLevel && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.cfaLevel}
                  </div>
                )}
              </div>

              {/* Target Exam Date */}
              <div className="space-y-2">
                <Label htmlFor="targetExamDate">Target exam date</Label>
                <Input
                  id="targetExamDate"
                  type="date"
                  value={formData.targetExamDate}
                  onChange={(e) => updateFormData('targetExamDate', e.target.value)}
                  className={errors.targetExamDate ? 'border-red-500' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.targetExamDate && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.targetExamDate}
                  </div>
                )}
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Your experience level</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => updateFormData('experienceLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner - New to CFA</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate - Some experience</SelectItem>
                    <SelectItem value="ADVANCED">Advanced - Retaking or experienced</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experienceLevel && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.experienceLevel}
                  </div>
                )}
              </div>

              {/* Study Hours */}
              <div className="space-y-2">
                <Label htmlFor="studyHoursPerWeek">
                  How many hours per week can you study?
                </Label>
                <Input
                  id="studyHoursPerWeek"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.studyHoursPerWeek}
                  onChange={(e) => updateFormData('studyHoursPerWeek', parseInt(e.target.value))}
                  className={errors.studyHoursPerWeek ? 'border-red-500' : ''}
                />
                {errors.studyHoursPerWeek && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.studyHoursPerWeek}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Recommended: 15-20 hours per week for Level 1
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Terms and Conditions */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Almost there!</h3>
                <p className="text-sm text-gray-600">
                  Just a few final details to complete your registration
                </p>
              </div>

              {/* Terms Agreement */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => updateFormData('agreeToTerms', checked)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="agreeToTerms"
                      className="text-sm font-normal cursor-pointer"
                    >
                      I agree to the{' '}
                      <Link href="/terms" className="text-cfa-blue hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-cfa-blue hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                    {errors.agreeToTerms && (
                      <div className="flex items-center text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.agreeToTerms}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onCheckedChange={(checked) => updateFormData('subscribeNewsletter', checked)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="subscribeNewsletter"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Send me study tips, updates, and special offers via email
                  </Label>
                </div>
              </div>

              {/* Account Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-gray-900">Account Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Name:</strong> {formData.name}</div>
                  <div><strong>Email:</strong> {formData.email}</div>
                  <div><strong>CFA Level:</strong> {formData.cfaLevel.replace('_', ' ')}</div>
                  <div><strong>Target Date:</strong> {formData.targetExamDate}</div>
                  <div><strong>Experience:</strong> {formData.experienceLevel}</div>
                  <div><strong>Study Hours/Week:</strong> {formData.studyHoursPerWeek}</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isLoading}
              >
                Previous
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                variant="cfa"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                variant="cfa"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-cfa-blue hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}