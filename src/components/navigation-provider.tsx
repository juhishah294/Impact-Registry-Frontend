import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setGlobalNavigate } from '@/contexts/auth-context'

interface NavigationProviderProps {
  children: React.ReactNode
}

const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    // Set the global navigate function
    setGlobalNavigate(navigate)
  }, [navigate])

  return <>{children}</>
}

export default NavigationProvider
