import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ME } from '@/graphql/queries'
import { useToast } from '@/hooks/use-toast'

// Global navigation function
let globalNavigate: ((path: string) => void) | null = null

export const setGlobalNavigate = (navigate: (path: string) => void) => {
  globalNavigate = navigate
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'SUPER_ADMIN' | 'INSTITUTE_ADMIN' | 'ADMIN' | 'DATA_ENTRY'
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' // Made optional since backend returns numeric value
  instituteId?: string
  institute?: {
    id: string
    centerName: string
    approvalStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
    approvedAt?: string
    rejectionReason?: string
  }
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: any
  isAuthenticated: boolean
  isApproved: boolean
  isInstituteAdmin: boolean
  logout: () => void
  refetch: () => void
  setToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasToken, setHasToken] = useState(!!localStorage.getItem('token'))
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const { data, loading, error, refetch } = useQuery(GET_ME, {
    skip: !hasToken,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me)
        setIsAuthenticated(true)
      }
    },
    onError: (error) => {
      console.error('Auth error:', error)
      
      // Check for JWT expired error specifically
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const jwtExpiredError = error.graphQLErrors.find(
          (err: any) => err.extensions?.code === 'JWT_EXPIRED'
        )
        
        if (jwtExpiredError) {
          console.log('JWT expired, redirecting to login page')
          // Immediately clear all auth state
          setToken(null)
          setUser(null)
          setIsAuthenticated(false)
          
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive"
          })
          
          // Use global navigation function
          if (globalNavigate) {
            globalNavigate('/login')
          } else {
            // Fallback to window.location if globalNavigate is not available
            window.location.href = '/login'
          }
          return
        }
        
        // Handle enum errors gracefully
        const enumError = error.graphQLErrors.find(
          (err: any) => err.message.includes('cannot represent value')
        )
        
        if (enumError) {
          console.warn('GraphQL enum error detected:', enumError.message)
          // Don't clear token for enum errors, just log the warning
          return
        }
      }
      
      // If token is invalid, clear it
      if (error.message.includes('UNAUTHENTICATED') || error.message.includes('AUTHENTICATION_ERROR')) {
        setToken(null)
      }
    }
  })

  // Polling functions
  const startPolling = () => {
    if (pollingIntervalRef.current) return // Already polling
    
    pollingIntervalRef.current = setInterval(() => {
      if (localStorage.getItem('token')) {
        refetch()
      }
    }, 30000) // Poll every 30 seconds
  }

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token)
      setHasToken(true)
    } else {
      localStorage.removeItem('token')
      setHasToken(false)
      setUser(null)
      setIsAuthenticated(false)
      stopPolling()
    }
  }

  const logout = () => {
    setToken(null)
    
    // Use global navigation function
    if (globalNavigate) {
      globalNavigate('/login')
    } else {
      // Fallback to window.location if globalNavigate is not available
      window.location.href = '/login'
    }
  }

  const isApproved = user?.institute?.approvalStatus === 'APPROVED'
  const isInstituteAdmin = user?.role === 'INSTITUTE_ADMIN'

  // Check authentication status on mount and start polling
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      refetch()
      startPolling()
    } else {
      setIsAuthenticated(false)
      setUser(null)
    }
    
    return () => {
      stopPolling()
    }
  }, [refetch])

  // Start polling when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      startPolling()
    } else {
      stopPolling()
    }
  }, [isAuthenticated, user])

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    isApproved,
    isInstituteAdmin,
    logout,
    refetch,
    setToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
