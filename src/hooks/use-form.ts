import { useState, useCallback } from 'react'
import { z } from 'zod'

interface UseFormOptions<T> {
  schema?: z.ZodSchema<T>
  onSubmit: (data: T) => Promise<void> | void
  defaultValues?: Partial<T>
  validateOnChange?: boolean
}

interface UseFormReturn<T> {
  data: T
  errors: Record<string, string>
  isLoading: boolean
  isValid: boolean
  isDirty: boolean
  handleChange: (field: keyof T, value: any) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  reset: () => void
  setData: (data: Partial<T>) => void
  setError: (field: keyof T, message: string) => void
  clearErrors: () => void
  validateField: (field: keyof T) => boolean
  validateForm: () => boolean
}

export function useForm<T extends Record<string, any>>({
  schema,
  onSubmit,
  defaultValues = {},
  validateOnChange = true,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [data, setDataState] = useState<T>(defaultValues as T)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const handleChange = useCallback((field: keyof T, value: any) => {
    setDataState(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
    
    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
    }

    // Validate on change if enabled
    if (validateOnChange && schema) {
      setTimeout(() => validateField(field), 100)
    }
  }, [errors, validateOnChange, schema])

  const setData = useCallback((newData: Partial<T>) => {
    setDataState(prev => ({ ...prev, ...newData }))
    setIsDirty(true)
  }, [])

  const setError = useCallback((field: keyof T, message: string) => {
    setErrors(prev => ({ ...prev, [field as string]: message }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const reset = useCallback(() => {
    setDataState(defaultValues as T)
    setErrors({})
    setIsLoading(false)
    setIsDirty(false)
  }, [defaultValues])

  const validateField = useCallback((field: keyof T): boolean => {
    if (!schema) return true

    try {
      const fieldSchema = schema.pick({ [field]: true } as any)
      fieldSchema.parse({ [field]: data[field] })
      
      // Clear error if validation passes
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
      
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === field)
        if (fieldError) {
          setError(field, fieldError.message)
        }
      }
      return false
    }
  }, [schema, data, setError])

  const validateForm = useCallback((): boolean => {
    if (!schema) return true

    try {
      schema.parse(data)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          const path = err.path.join('.')
          newErrors[path] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }, [schema, data])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onSubmit(data)
      setIsDirty(false)
    } catch (error) {
      if (error instanceof Error) {
        setError('submit' as keyof T, error.message)
      } else {
        setError('submit' as keyof T, 'An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }, [data, validateForm, onSubmit, setError])

  const isValid = Object.keys(errors).length === 0

  return {
    data,
    errors,
    isLoading,
    isValid,
    isDirty,
    handleChange,
    handleSubmit,
    reset,
    setData,
    setError,
    clearErrors,
    validateField,
    validateForm,
  }
}

// Specialized form hooks
export function useLoginForm(onSubmit: (data: any) => Promise<void>) {
  return useForm({
    schema: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
    onSubmit,
    defaultValues: {
      email: '',
      password: '',
    },
  })
}

export function useRegisterForm(onSubmit: (data: any) => Promise<void>) {
  return useForm({
    schema: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
      cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']),
      experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
      studyHoursPerWeek: z.number().min(1).max(80),
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
    onSubmit,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      cfaLevel: 'LEVEL_1',
      experienceLevel: 'BEGINNER',
      studyHoursPerWeek: 15,
    },
  })
}

export function useProfileForm(onSubmit: (data: any) => Promise<void>, initialData: any = {}) {
  return useForm({
    schema: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters').optional(),
      email: z.string().email('Invalid email address').optional(),
      cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']).optional(),
      experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
      studyHoursPerWeek: z.number().min(1).max(80).optional(),
      targetExamDate: z.date().optional(),
    }),
    onSubmit,
    defaultValues: initialData,
    validateOnChange: false, // Validate only on submit for profile updates
  })
}