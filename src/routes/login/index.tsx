import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '@/graphql/mutations'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const { isAuthenticated, setToken, refetch } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [loginUser] = useMutation(LOGIN_USER)

  // Get the intended destination from location state
  const from = location.state?.from || '/dashboard'

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    try {
      const result = await loginUser({
        variables: { email, password }
      })

      if (result.data?.login) {
        const { user, token } = result.data.login
        
        // Set token using auth context (this will trigger refetch automatically)
        setToken(token)
        
        // Manually refetch to ensure immediate update
        try {
          await refetch()
        } catch (error) {
          console.error('Manual refetch error:', error)
        }
        
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${user.firstName}!`,
          variant: "success"
        })
        
        // Small delay to ensure auth context updates before navigation
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 100)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Pediatric CKD Registry
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the Pediatric CKD Registry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="p-0 h-auto text-sm">
                  Forgot password?
                </Button>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <div className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto"
                onClick={() => navigate('/register')}
              >
                Register here
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
